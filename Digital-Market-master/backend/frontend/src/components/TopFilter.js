import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const TopFilter = ({ onSearch }) => {
  const [q, setQ] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (onSearch) onSearch(q)
  }
  return (
    <Form onSubmit={submit} className="top-filter container">
      <div className="row g-2 align-items-center">
        <div className="col-auto" style={{flex:1}}>
          <Form.Control placeholder="Search products" value={q} onChange={e=>setQ(e.target.value)} />
        </div>
        <div className="col-auto">
          <Button type="submit" variant="primary">Search</Button>
        </div>
      </div>
    </Form>
  )
}

export default TopFilter
