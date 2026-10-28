import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { FiEdit2, FiKey, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { Badge, BtnBlue, BtnGhost, Card, Input, LoadingState, PageHeader, Pagination, Select, Table } from "../../../components/ui/UI";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { Modal } from "../../../components/ui/Modal";
import useDebounce from "../../../components/useDebounce";
import { createUser, deleteUser, fetchUsers, resetUserPassword, updateUser } from "../../../services/apiServices/userService";

const blank = { name: "", email: "", password: "", role: "Technician", isActive: true };
const currentUser = () => { try { return JSON.parse(localStorage.getItem("users") || "{}"); } catch { return {}; } };

function UserModal({ user, onClose, onSaved }) {
  const editing = Boolean(user?.id);
  const [form, setForm] = useState(
    editing
      ? { name: user.name, email: user.email, role: user.role, isActive: Boolean(user.isActive) }
      : blank,
  );
  const [saving, setSaving] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = editing ? await updateUser(user.id, form) : await createUser(form);
      if (response?.success) {
        toast.success(response.message || `Staff user ${editing ? "updated" : "created"}`);
        onSaved();
      } else {
        toast.error(response?.message || "Unable to save user");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title={editing ? "Edit staff account" : "Create staff account"}
      sub="Manage workshop access, permissions and account availability."
      size="sm"
      onClose={saving ? undefined : onClose}
      footer={
        <>
          <BtnGhost type="button" onClick={onClose} disabled={saving}>Cancel</BtnGhost>
          <BtnBlue type="submit" form="staff-account-form" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save account" : "Create account"}
          </BtnBlue>
        </>
      }
    >
      <form id="staff-account-form" onSubmit={save} className="space-y-4">
        <Input label="Full name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
        <Input label="Email address" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
        {!editing && (
          <Input label="Temporary password" type="password" minLength="8" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Uppercase, lowercase and a number" required />
        )}
        <div className="pw-form-grid">
          <Select label="Role" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}>
            <option>Admin</option><option>Manager</option><option>Technician</option>
          </Select>
          <Select label="Account status" value={String(form.isActive)} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.value === "true" }))}>
            <option value="true">Active</option><option value="false">Inactive</option>
          </Select>
        </div>
      </form>
    </Modal>
  );
}

function PasswordModal({ user, onClose }) {
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await resetUserPassword(user.id, password);
      if (response?.success) {
        toast.success(response.message || "Password reset");
        onClose();
      } else {
        toast.error(response?.message || "Unable to reset password");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={Boolean(user)}
      title={`Reset ${user.name}’s password`}
      sub="The existing session will be revoked immediately after the password is changed."
      size="xs"
      onClose={saving ? undefined : onClose}
      footer={
        <>
          <BtnGhost type="button" onClick={onClose} disabled={saving}>Cancel</BtnGhost>
          <BtnBlue type="submit" form="password-reset-form" disabled={saving}>
            {saving ? "Resetting…" : "Reset password"}
          </BtnBlue>
        </>
      }
    >
      <form id="password-reset-form" onSubmit={save}>
        <Input label="New password" type="password" minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Uppercase, lowercase and a number" required />
      </form>
    </Modal>
  );
}
export default function Users() {
  const me = currentUser();
  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [active, setActive] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [passwordUser, setPasswordUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const query = useDebounce(search);
  const load = useCallback(async (page = 1) => {
    setLoading(true);
    const response = await fetchUsers({ search: query, role, isActive: active, page, limit: 20 });
    if (response?.success) { setRecords(response.data || []); setMeta(response.meta || { page, pages: 1, total: response.data?.length || 0, limit: 20 }); }
    else toast.error(response?.message || "Unable to load staff users");
    setLoading(false);
  }, [query, role, active]);
  useEffect(() => { load(1); }, [load]);
  const remove = async () => {
    const response = await deleteUser(deleteTarget.id);
    if (response?.success) { toast.success(response.message || "User deleted"); setDeleteTarget(null); load(meta.page); }
    else toast.error(response?.message || "Unable to delete user");
  };
  return <div className="space-y-5"><PageHeader title="Team users" sub={`${meta.total || 0} staff accounts with role-based access`} action={<BtnBlue onClick={() => setEditing({})}><FiPlus /> Add staff user</BtnBlue>} /><Card className="overflow-hidden"><div className="pw-list-toolbar"><div className="pw-search-box"><FiSearch /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email" /></div><div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"><select className="pw-control pw-select sm:max-w-44" value={role} onChange={(e) => setRole(e.target.value)}><option value="">All roles</option><option>Admin</option><option>Manager</option><option>Technician</option></select><select className="pw-control pw-select sm:max-w-44" value={active} onChange={(e) => setActive(e.target.value)}><option value="">All accounts</option><option value="true">Active</option><option value="false">Inactive</option></select></div></div>{loading ? <LoadingState label="Loading team accounts…" /> : <><div className="pw-mobile-records">{records.map((user) => <article className="pw-record-card" key={user.id}><div className="flex items-start justify-between gap-3"><div><p className="pw-eyebrow">{user.role}</p><h3>{user.name}</h3><p>{user.email}</p></div><Badge status={user.isActive ? "Active" : "Inactive"} /></div><div className="pw-record-details"><span>Last login: {user.lastLoginAt ? moment(user.lastLoginAt).format("DD MMM YYYY, HH:mm") : "Never"}</span><span>Created: {moment(user.createdAt).format("DD MMM YYYY")}</span></div><div className="pw-record-actions"><button onClick={() => setEditing(user)}><FiEdit2 /> Edit</button><button onClick={() => setPasswordUser(user)}><FiKey /> Password</button>{String(user.id) !== String(me.id) && <button className="danger" onClick={() => setDeleteTarget(user)}><FiTrash2 /> Delete</button>}</div></article>)}</div><div className="pw-desktop-table"><Table headers={["Name", "Email", "Role", "Status", "Last login", "Created", "Actions"]} empty={!records.length ? "No staff users found" : null}>{records.map((user) => <tr key={user.id}><td className="font-bold text-[#111c34]">{user.name}</td><td>{user.email}</td><td>{user.role}</td><td><Badge status={user.isActive ? "Active" : "Inactive"} /></td><td>{user.lastLoginAt ? moment(user.lastLoginAt).format("DD MMM YYYY, HH:mm") : "Never"}</td><td>{moment(user.createdAt).format("DD MMM YYYY")}</td><td><div className="flex gap-2"><button className="pw-icon-button" onClick={() => setEditing(user)}><FiEdit2 /></button><button className="pw-icon-button" onClick={() => setPasswordUser(user)}><FiKey /></button>{String(user.id) !== String(me.id) && <button className="pw-icon-button pw-icon-button--danger" onClick={() => setDeleteTarget(user)}><FiTrash2 /></button>}</div></td></tr>)}</Table></div><Pagination meta={meta} disabled={loading} onPageChange={load} /></>}</Card>{editing && <UserModal user={editing.id ? editing : null} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(meta.page); }} />}{passwordUser && <PasswordModal user={passwordUser} onClose={() => setPasswordUser(null)} />}<ConfirmDialog open={Boolean(deleteTarget)} title="Delete staff account?" message="This permanently removes the account. You cannot delete yourself or the final active admin." confirmText="Delete account" cancelText="Keep account" onConfirm={remove} onClose={() => setDeleteTarget(null)} /></div>;
}
