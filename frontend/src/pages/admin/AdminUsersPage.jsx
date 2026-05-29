import AdminLayout from '../../components/admin/AdminLayout.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService.js'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    adminService.users()
      .then((data) => {
        if (active) setUsers(data)
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load users.')
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <AdminLayout title="Users management">
      {error && <p className="muted">{error}</p>}
      <DataTable columns={[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }, { key: 'status', label: 'Status' }]} rows={users} />
    </AdminLayout>
  )
}
