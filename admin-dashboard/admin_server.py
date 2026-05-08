"""
Standalone lightweight Admin API server — no Docker, no PostgreSQL, no Redis.
Uses SQLite + Firebase Auth verification.
Run: python admin_server.py
"""
import os, datetime, sqlite3, json
from pathlib import Path
from contextlib import contextmanager

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DB_PATH = Path(__file__).parent / "admin.db"
SUPER_ADMIN_UID = "kEx3N7shT2Zzo50i3grmeht2wiU2"

# ── DB Setup ───────────────────────────────────────────────────────────────

def get_db():
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    with sqlite3.connect(str(DB_PATH)) as conn:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firebase_uid TEXT UNIQUE NOT NULL,
            email TEXT NOT NULL,
            display_name TEXT,
            plan TEXT DEFAULT 'free',
            created_at TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS user_credits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE REFERENCES users(id),
            balance REAL DEFAULT 0.0,
            status TEXT DEFAULT 'active'
        );
        CREATE TABLE IF NOT EXISTS credit_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            amount REAL NOT NULL,
            reason TEXT,
            performed_by TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS charge_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            amount REAL NOT NULL,
            transfer_number TEXT,
            screenshot_url TEXT,
            notes TEXT,
            status TEXT DEFAULT 'pending',
            review_note TEXT,
            reviewed_by TEXT,
            created_at TEXT DEFAULT (datetime('now')),
            reviewed_at TEXT
        );
        CREATE TABLE IF NOT EXISTS admin_roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firebase_uid TEXT UNIQUE NOT NULL,
            email TEXT NOT NULL,
            role TEXT DEFAULT 'sub_admin',
            can_approve_charges INTEGER DEFAULT 1,
            is_active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS datasets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            filename TEXT,
            row_count INTEGER,
            col_count INTEGER,
            source TEXT DEFAULT 'upload',
            created_at TEXT DEFAULT (datetime('now'))
        );
        """)
        # Ensure super admin exists
        conn.execute("""
            INSERT OR IGNORE INTO admin_roles (firebase_uid, email, role, can_approve_charges, is_active)
            VALUES (?, 'ebrahimsabrey2001@gmail.com', 'super_admin', 1, 1)
        """, (SUPER_ADMIN_UID,))
        conn.commit()

# ── Firebase token verification (optional) ────────────────────────────────

def verify_firebase_token(token: str) -> str:
    """Returns uid. If firebase_admin is not available, treat token as uid (dev)."""
    try:
        import firebase_admin
        from firebase_admin import auth as fb_auth
        try:
            app = firebase_admin.get_app()
        except ValueError:
            from firebase_admin import credentials
            # Initialize without service account — token verification won't work without it
            firebase_admin.initialize_app()
        decoded = fb_auth.verify_id_token(token)
        return decoded["uid"]
    except Exception:
        # Dev mode: treat token as UID
        return token

def get_admin_uid(authorization: str | None = Header(default=None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing token")
    token = authorization.split(" ", 1)[1]
    uid = verify_firebase_token(token)
    if uid != SUPER_ADMIN_UID:
        raise HTTPException(403, "Not an admin")
    return uid

# ── App ────────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(title="Kimit Admin API (Lightweight)", lifespan=lifespan)
app.add_middleware(CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "ok", "mode": "sqlite-local"}

@app.post("/api/auth/sync")
def sync_user(authorization: str | None = Header(default=None), db=Depends(get_db)):
    """Called by the main Kimit app on every login — auto-registers user in admin DB."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing token")
    token = authorization.split(" ", 1)[1]
    uid = verify_firebase_token(token)

    # Try to get display_name and email from Firebase token claims
    try:
        import firebase_admin
        from firebase_admin import auth as fb_auth
        try:
            firebase_admin.get_app()
        except ValueError:
            firebase_admin.initialize_app()
        decoded = fb_auth.verify_id_token(token)
        email = decoded.get("email", "")
        display_name = decoded.get("name", "")
    except Exception:
        # Dev mode: uid is used as token, we can't get email
        email = f"{uid}@unknown.local"
        display_name = ""

    # Upsert user into users table
    existing = db.execute("SELECT id FROM users WHERE firebase_uid = ?", (uid,)).fetchone()
    if not existing:
        db.execute(
            "INSERT INTO users (firebase_uid, email, display_name) VALUES (?, ?, ?)",
            (uid, email, display_name)
        )
        db.commit()
        # Create default credit record
        user_id = db.execute("SELECT id FROM users WHERE firebase_uid = ?", (uid,)).fetchone()["id"]
        db.execute("INSERT OR IGNORE INTO user_credits (user_id, balance, status) VALUES (?, 0.0, 'active')", (user_id,))
        db.commit()
    else:
        # Update email/name in case they changed
        db.execute(
            "UPDATE users SET email = ?, display_name = ? WHERE firebase_uid = ?",
            (email, display_name, uid)
        )
        db.commit()

    return {"synced": True, "uid": uid}

# ── Stats ──────────────────────────────────────────────────────────────────
@app.get("/admin/stats")
def stats(uid: str = Depends(get_admin_uid), db=Depends(get_db)):
    total_users = db.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    total_credits = db.execute("SELECT COALESCE(SUM(balance),0) FROM user_credits").fetchone()[0]
    pending = db.execute("SELECT COUNT(*) FROM charge_requests WHERE status='pending'").fetchone()[0]
    total_datasets = db.execute("SELECT COUNT(*) FROM datasets").fetchone()[0]
    return {"total_users": total_users, "total_credits_issued": total_credits,
            "pending_charge_requests": pending, "total_datasets": total_datasets}

# ── Users ──────────────────────────────────────────────────────────────────
@app.get("/admin/users")
def list_users(page: int = 1, limit: int = 20, search: str = "",
               uid: str = Depends(get_admin_uid), db=Depends(get_db)):
    offset = (page - 1) * limit
    like = f"%{search}%"
    total = db.execute(
        "SELECT COUNT(*) FROM users WHERE email LIKE ? OR display_name LIKE ?", (like, like)
    ).fetchone()[0]
    rows = db.execute("""
        SELECT u.id, u.firebase_uid, u.email, u.display_name, u.plan, u.created_at,
               COALESCE(c.balance, 0.0) as credit_balance,
               COALESCE(c.status, 'active') as credit_status,
               (SELECT COUNT(*) FROM datasets d WHERE d.user_id = u.id) as dataset_count
        FROM users u LEFT JOIN user_credits c ON c.user_id = u.id
        WHERE u.email LIKE ? OR u.display_name LIKE ?
        ORDER BY u.created_at DESC LIMIT ? OFFSET ?
    """, (like, like, limit, offset)).fetchall()
    return {"users": [dict(r) for r in rows], "total": total, "page": page, "limit": limit}

@app.get("/admin/users/{user_id}")
def get_user(user_id: int, uid: str = Depends(get_admin_uid), db=Depends(get_db)):
    u = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    if not u: raise HTTPException(404, "User not found")
    credit = db.execute("SELECT * FROM user_credits WHERE user_id = ?", (user_id,)).fetchone()
    datasets = db.execute("SELECT * FROM datasets WHERE user_id = ? ORDER BY created_at DESC", (user_id,)).fetchall()
    txns = db.execute("SELECT * FROM credit_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50", (user_id,)).fetchall()
    return {
        **dict(u),
        "credit": dict(credit) if credit else {"balance": 0.0, "status": "active"},
        "datasets": [dict(d) for d in datasets],
        "transactions": [dict(t) for t in txns],
    }

class CreditAdjust(BaseModel):
    amount: float
    reason: str | None = None

@app.post("/admin/users/{user_id}/credits")
def adjust_credit(user_id: int, body: CreditAdjust,
                  uid: str = Depends(get_admin_uid), db=Depends(get_db)):
    credit = db.execute("SELECT * FROM user_credits WHERE user_id = ?", (user_id,)).fetchone()
    if not credit:
        db.execute("INSERT INTO user_credits (user_id, balance) VALUES (?, 0.0)", (user_id,))
        db.commit()
        credit = db.execute("SELECT * FROM user_credits WHERE user_id = ?", (user_id,)).fetchone()
    new_balance = max(0.0, credit["balance"] + body.amount)
    db.execute("UPDATE user_credits SET balance = ? WHERE user_id = ?", (new_balance, user_id))
    db.execute("INSERT INTO credit_transactions (user_id, amount, reason, performed_by) VALUES (?,?,?,?)",
               (user_id, body.amount, body.reason, uid))
    db.commit()
    return {"balance": new_balance}

class StatusUpdate(BaseModel):
    status: str

@app.put("/admin/users/{user_id}/status")
def update_status(user_id: int, body: StatusUpdate,
                  uid: str = Depends(get_admin_uid), db=Depends(get_db)):
    credit = db.execute("SELECT * FROM user_credits WHERE user_id = ?", (user_id,)).fetchone()
    if not credit:
        db.execute("INSERT INTO user_credits (user_id, status) VALUES (?, ?)", (user_id, body.status))
    else:
        db.execute("UPDATE user_credits SET status = ? WHERE user_id = ?", (body.status, user_id))
    db.commit()
    return {"status": body.status}

# ── Charge Requests ────────────────────────────────────────────────────────
@app.get("/admin/charge-requests")
def list_charges(status_filter: str = "pending", page: int = 1, limit: int = 20,
                 uid: str = Depends(get_admin_uid), db=Depends(get_db)):
    offset = (page - 1) * limit
    where = "WHERE cr.status = ?" if status_filter != "all" else ""
    params = [status_filter, limit, offset] if status_filter != "all" else [limit, offset]
    total = db.execute(f"SELECT COUNT(*) FROM charge_requests cr {where}",
                       [status_filter] if status_filter != "all" else []).fetchone()[0]
    rows = db.execute(f"""
        SELECT cr.*, u.email as user_email, u.display_name as user_name
        FROM charge_requests cr LEFT JOIN users u ON u.id = cr.user_id
        {where} ORDER BY cr.created_at DESC LIMIT ? OFFSET ?
    """, params).fetchall()
    return {"requests": [dict(r) for r in rows], "total": total, "page": page, "limit": limit}

class ChargeReview(BaseModel):
    action: str
    note: str | None = None

@app.put("/admin/charge-requests/{req_id}/review")
def review_charge(req_id: int, body: ChargeReview,
                  uid: str = Depends(get_admin_uid), db=Depends(get_db)):
    req = db.execute("SELECT * FROM charge_requests WHERE id = ?", (req_id,)).fetchone()
    if not req: raise HTTPException(404, "Not found")
    if req["status"] != "pending": raise HTTPException(400, "Already reviewed")
    new_status = "approved" if body.action == "approve" else "rejected"
    db.execute("UPDATE charge_requests SET status=?, review_note=?, reviewed_by=?, reviewed_at=? WHERE id=?",
               (new_status, body.note, uid, datetime.datetime.now(datetime.timezone.utc).isoformat(), req_id))
    if body.action == "approve":
        credit = db.execute("SELECT * FROM user_credits WHERE user_id = ?", (req["user_id"],)).fetchone()
        if credit:
            db.execute("UPDATE user_credits SET balance = balance + ? WHERE user_id = ?", (req["amount"], req["user_id"]))
        else:
            db.execute("INSERT INTO user_credits (user_id, balance) VALUES (?, ?)", (req["user_id"], req["amount"]))
        db.execute("INSERT INTO credit_transactions (user_id, amount, reason, performed_by) VALUES (?,?,?,?)",
                   (req["user_id"], req["amount"], f"Charge #{req_id} approved", uid))
    db.commit()
    return {"status": new_status}

# ── Sub-Admins ─────────────────────────────────────────────────────────────
@app.get("/admin/sub-admins")
def list_admins(uid: str = Depends(get_admin_uid), db=Depends(get_db)):
    rows = db.execute("SELECT * FROM admin_roles").fetchall()
    return [dict(r) for r in rows]

class SubAdminCreate(BaseModel):
    email: str
    firebase_uid: str
    role: str = "sub_admin"
    can_approve_charges: bool = True

@app.post("/admin/sub-admins")
def add_admin(body: SubAdminCreate, uid: str = Depends(get_admin_uid), db=Depends(get_db)):
    try:
        db.execute("INSERT INTO admin_roles (firebase_uid, email, role, can_approve_charges) VALUES (?,?,?,?)",
                   (body.firebase_uid, body.email, body.role, int(body.can_approve_charges)))
        db.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(400, "Admin already exists")
    return {"success": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("admin_server:app", host="0.0.0.0", port=8000, reload=False)
