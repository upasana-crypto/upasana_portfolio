import React from 'react'

// This component renders the large logo for the login screen and sidebar
export const CustomLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <img
      src="/logo_red.png" // ⬅️ REPLACE this path with your logo file in /public
      alt="Nrtyopasana Logo"
      style={{ height: '40px', width: 'auto' }}
    />
  </div>
)

export default CustomLogo
