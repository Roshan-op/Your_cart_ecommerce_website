import React from 'react'
import { Link } from 'react-router-dom'

const HeroBanner = () => {
  return (
    <div className="hero-banner">
      <div className="hero-inner">
        <div className="hero-left">
          <h1>Discover top products</h1>
          <p>Quality picks, fast delivery — hand selected for you.</p>
          <Link to="/" className="hero-cta">Shop Now</Link>
        </div>
        <div className="hero-right">
          <img src="/images/watch.avif" alt="hero" style={{maxWidth:220,borderRadius:12}} />
        </div>
      </div>
    </div>
  )
}

export default HeroBanner
