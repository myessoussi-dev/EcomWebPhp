import AdminLayout from '../../components/admin/AdminLayout.jsx'
import DataTable from '../../components/admin/DataTable.jsx'

const users = [
  { id: 1, name: 'Demo Customer', email: 'customer@example.com', role: 'Customer', status: 'Active' },
  { id: 2, name: 'Store Manager', email: 'manager@example.com', role: 'Admin', status: 'Active' },
  { id: 3, name: 'Wholesale Buyer', email: 'buyer@example.com', role: 'Customer', status: 'Pending' },
]

export default function AdminUsersPage() {
  return <AdminLayout title="Users management"><DataTable columns={[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }, { key: 'status', label: 'Status' }]} rows={users} /></AdminLayout>
}
