import mernDashApi from "./apiUtils"

// Insurance Options
export const getInsuranceOptions = async function(){
    return await mernDashApi.get(process.env.REACT_APP_API_URL + '/api/insuranceoptions')
}

export const getInsuranceOption = async function(id){
    return await mernDashApi.get(process.env.REACT_APP_API_URL + '/api/insuranceoptions/detail?Id='+id)
}

export const upsertInsuranceOptions = async function(parameters){
    return await mernDashApi.post(process.env.REACT_APP_API_URL + '/api/insuranceoptions/upsert',{...parameters})
}

export const deleteInsuranceOption = async function(id){
    return await mernDashApi.get(process.env.REACT_APP_API_URL + '/api/insuranceoptions/delete?Id='+id)
}

// Package Categories

export const getPackageCategories = async function(){
    return await mernDashApi.get(process.env.REACT_APP_API_URL + '/api/packagecategories')
}

export const getPackageCategory = async function(id){
    return await mernDashApi.get(process.env.REACT_APP_API_URL + '/api/packagecategories/detail?Id='+id)
}

export const upsertPackageCategory = async function(parameters){
    return await mernDashApi.post(process.env.REACT_APP_API_URL + '/api/packagecategories/upsert',{...parameters})
}

export const deletePackageCategory = async function(id){
    return await mernDashApi.get(process.env.REACT_APP_API_URL + '/api/packagecategories/delete?Id='+id)
}

export const changePackageCategoriesRange = async function(categories){
    return await mernDashApi.post(process.env.REACT_APP_API_URL + '/api/packagecategories/update/range',[...categories])
}

// Package Presets

export const getPackagePresets = async function(){
    return await mernDashApi.get(process.env.REACT_APP_API_URL + '/api/packagepresets')
}

export const getPackagePreset = async function(id){
    return await mernDashApi.get(process.env.REACT_APP_API_URL + '/api/packagepresets/detail?Id='+id)
}

export const upsertPackagePreset = async function(parameters){
    return await mernDashApi.post(process.env.REACT_APP_API_URL + '/api/packagepresets/upsert',{...parameters})
}

export const deletePackagePreset = async function(id){
    return await mernDashApi.get(process.env.REACT_APP_API_URL + '/api/packagepresets/delete?Id='+id)
}

export const changePackagePresetsRange = async function(presets){
    return await mernDashApi.post(process.env.REACT_APP_API_URL + '/api/packagepresets/update/range',[...presets])
}

export const getOrders = async function(){
    return await mernDashApi.get(process.env.REACT_APP_API_URL + '/api/order');
}