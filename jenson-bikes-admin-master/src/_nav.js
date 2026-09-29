import React from 'react'
import CIcon from '@coreui/icons-react'
import {

  cilFile,
  cilAddressBook,
  cilSpeedometer,
  cilWindowMaximize,
  cilMenu,
  cilSettings
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavTitle,
    name: 'Storefront',
  },
  {
    component: CNavGroup,
    name: "Insurance Options",
    to: "insurance-options",
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All',
        to: '/insurance-options',
      },
      {
        component: CNavItem,
        name: 'Add',
        to: '/insurance-options/add',
      }
    ]
  },
  {
    component: CNavGroup,
    name: "Package Categories",
    to: "package-categories",
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All',
        to: '/package-categories',
      },
      {
        component: CNavItem,
        name: 'Add',
        to: '/package-categories/add',
      }
    ]
  },
  {
    component: CNavGroup,
    name: "Package Purposes",
    to: "package-purposes",
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All',
        to: '/package-purposes',
      },
      {
        component: CNavItem,
        name: 'Add',
        to: '/package-purposes/add',
      }
    ]
  },
  {
    component: CNavGroup,
    name: "Package Presets",
    to: "package-presets",
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All',
        to: '/package-presets',
      },
      {
        component: CNavItem,
        name: 'Add',
        to: '/package-presets/add',
      }
    ]
  },
  {
    component: CNavGroup,
    name: "Orders",
    to: "orders",
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All',
        to: '/orders',
      }
    ]
  }
 
  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
]

export default _nav
