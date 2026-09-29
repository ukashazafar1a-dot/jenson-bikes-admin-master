import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Insurance Options
const InsuranceOptions = React.lazy(()=>import('./views/insuranceOptions/InsuranceOptions'))
const InsuranceOptionsAdd = React.lazy(()=>import('./views/insuranceOptions/Add'))
const InsuranceOptionsView = React.lazy(()=>import('./views/insuranceOptions/View'))
const InsuranceOptionsEdit = React.lazy(()=>import('./views/insuranceOptions/Edit'))

// Package Categories
const PackageCategories = React.lazy(()=>import('./views/packageCategories/packageCategories'))
const PackageCategoriesAdd = React.lazy(()=>import('./views/packageCategories/Add'))
const PackageCategoriesView = React.lazy(()=>import('./views/packageCategories/View'))
const PackageCategoriesEdit = React.lazy(()=>import('./views/packageCategories/Edit'))

// Package Purposes
const PackagePurposes = React.lazy(()=>import('./views/packagePurposes/packagePurposes'))
const PackagePurposesAdd = React.lazy(()=>import('./views/packagePurposes/Add'))
const PackagePurposesView = React.lazy(()=>import('./views/packagePurposes/View'))
const PackagePurposesEdit = React.lazy(()=>import('./views/packagePurposes/Edit'))

// Package Presets
const PackagePresets = React.lazy(()=>import('./views/packagePresets/PackagePresets'))
const PackagePresetsAdd = React.lazy(()=>import('./views/packagePresets/Add'))
const PackagePresetsView = React.lazy(()=>import('./views/packagePresets/View'))
const PackagePresetsEdit = React.lazy(()=>import('./views/packagePresets/Edit'))

// Orders
const Orders = React.lazy(()=>import('./views/orders/Orders'))

//pages
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
// const PageLogin = React.lazy(() => import('./views/pages/login/Login'))
const ChangePassword = React.lazy(() => import('./views/pages/changePassword/ChangePassword'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/insurance-options', name: 'Insurance Options', element: InsuranceOptions },
  { path: '/insurance-options/add', name: 'Add Insurance', element: InsuranceOptionsAdd },
  { path: '/insurance-options/view/:id',name: 'View Insurance', element: InsuranceOptionsView },
  { path: '/insurance-options/edit/:id', name: 'Edit Insurance', element: InsuranceOptionsEdit },
  { path: '/package-categories', name: 'Package Categories', element: PackageCategories },
  { path: '/package-categories/add', name: 'Add Category', element: PackageCategoriesAdd },
  { path: '/package-categories/view/:id',name: 'View Category', element: PackageCategoriesView },
  { path: '/package-categories/edit/:id', name: 'Edit Category', element: PackageCategoriesEdit },
  { path: '/package-purposes', name: 'Package Purposes', element: PackagePurposes },
  { path: '/package-purposes/add', name: 'Add Purpose', element: PackagePurposesAdd },
  { path: '/package-purposes/view/:id',name: 'View Purpose', element: PackagePurposesView },
  { path: '/package-purposes/edit/:id', name: 'Edit Purpose', element: PackagePurposesEdit },
  { path: '/package-presets', name: 'Package Presets', element: PackagePresets },
  { path: '/package-presets/add', name: 'Add Preset', element: PackagePresetsAdd },
  { path: '/package-presets/view/:id',name: 'View Preset', element: PackagePresetsView },
  { path: '/package-presets/edit/:id', name: 'Edit Preset', element: PackagePresetsEdit },
  { path: '/orders', name: 'Orders', element: Orders },

  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  { path: '*', name: '404', element: Page404 },
  // { path: '/user/login', name: 'Login', element: PageLogin},
  { path: '/user/change-password', name: 'Change Password', element: ChangePassword }
]

export default routes
