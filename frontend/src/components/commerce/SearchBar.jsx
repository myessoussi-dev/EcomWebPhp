import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button.jsx'

export default function SearchBar({ defaultValue = '' }) {
  const [value, setValue] = useState(defaultValue)
  const navigate = useNavigate()
  function submit(event) {
    event.preventDefault()
    const term = value.trim()
    navigate(term ? `/search?q=${encodeURIComponent(term)}` : '/shop')
  }
  return (
    <form className="searchbar" onSubmit={submit} role="search">
      <input aria-label="Search products" onChange={(event) => setValue(event.target.value)} placeholder="Search products, categories, styles..." value={value} />
      <Button type="submit">Search</Button>
    </form>
  )
}
