'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Mail, Building, Calendar, Save, Fingerprint } from 'lucide-react'

interface EmployeeForm {
  firstName: string
  lastName: string
  email: string
  empId: string
  department: string
  position: string
  joinDate: string
  phone: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  status: 'Active' | 'Inactive'
}

const departments = ['Engineering', 'Marketing', 'HR', 'Finance', 'Operations', 'Sales']
const positions = {
  Engineering: ['Software Developer', 'Senior Developer', 'DevOps Engineer', 'QA Engineer', 'Tech Lead'],
  Marketing: ['Marketing Manager', 'Content Creator', 'Social Media Manager', 'SEO Specialist'],
  HR: ['HR Manager', 'HR Specialist', 'Recruiter', 'Training Coordinator'],
  Finance: ['Financial Analyst', 'Accountant', 'Finance Manager', 'Budget Analyst'],
  Operations: ['Operations Manager', 'Project Manager', 'Business Analyst'],
  Sales: ['Sales Representative', 'Sales Manager', 'Account Executive', 'Business Development']
}

export default function AddEmployeePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [fingerprintEnrolled, setFingerprintEnrolled] = useState(false)
  
  const [formData, setFormData] = useState<EmployeeForm>({
    firstName: '',
    lastName: '',
    email: '',
    empId: '',
    department: '',
    position: '',
    joinDate: new Date().toISOString().split('T')[0],
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    status: 'Active'
  })

  const [errors, setErrors] = useState<Partial<EmployeeForm>>({})

  const handleInputChange = (field: keyof EmployeeForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Partial<EmployeeForm> = {}

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.lastName) newErrors.lastName = 'Last name is required'
      if (!formData.email) newErrors.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format'
      }
      if (!formData.empId) newErrors.empId = 'Employee ID is required'
    } else if (step === 2) {
      if (!formData.department) newErrors.department = 'Department is required'
      if (!formData.position) newErrors.position = 'Position is required'
      if (!formData.joinDate) newErrors.joinDate = 'Join date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(2)) return

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Employee data:', formData)
      console.log('Fingerprint enrolled:', fingerprintEnrolled)
      
      router.push('/dashboard/employees')
    } catch (error) {
      console.error('Error adding employee:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const enrollFingerprint = async () => {
    setIsLoading(true)
    try {
      // Simulate fingerprint enrollment
      await new Promise(resolve => setTimeout(resolve, 3000))
      setFingerprintEnrolled(true)
    } catch (error) {
      console.error('Fingerprint enrollment failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const stepTitles = ['Basic Information', 'Job Details', 'Biometric Setup']

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Employee</h1>
          <p className="text-slate-400 mt-1">Create a new employee record and enroll biometric data</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-between">
            {stepTitles.map((title, index) => {
              const stepNumber = index + 1
              const isActive = currentStep === stepNumber
              const isCompleted = currentStep > stepNumber
              
              return (
                <div key={stepNumber} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                    ${isCompleted ? 'bg-green-500 text-white' : 
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}
                  `}>
                    {stepNumber}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {title}
                  </span>
                  {index < stepTitles.length - 1 && (
                    <div className={`mx-4 flex-1 h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-slate-700'}`}></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </h2>
            </div>
            <div className="card-content space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.firstName ? 'border-red-500' : 'border-slate-700'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.lastName ? 'border-red-500' : 'border-slate-700'
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-slate-700'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    value={formData.empId}
                    onChange={(e) => handleInputChange('empId', e.target.value)}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.empId ? 'border-red-500' : 'border-slate-700'
                    }`}
                    placeholder="e.g., EMP001"
                  />
                  {errors.empId && <p className="mt-1 text-sm text-red-400">{errors.empId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full address"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Job Details */}
        {currentStep === 2 && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Building className="w-5 h-5" />
                Job Details
              </h2>
            </div>
            <div className="card-content space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => {
                      handleInputChange('department', e.target.value)
                      handleInputChange('position', '') // Reset position when department changes
                    }}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.department ? 'border-red-500' : 'border-slate-700'
                    }`}
                  >
                    <option value="">Select Position</option>
                    {formData.department && positions[formData.department as keyof typeof positions]?.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                  {errors.position && <p className="mt-1 text-sm text-red-400">{errors.position}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Join Date *
                  </label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => handleInputChange('joinDate', e.target.value)}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.joinDate ? 'border-red-500' : 'border-slate-700'
                    }`}
                  />
                  {errors.joinDate && <p className="mt-1 text-sm text-red-400">{errors.joinDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as 'Active' | 'Inactive')}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Emergency contact name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Emergency contact phone"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Biometric Setup */}
        {currentStep === 3 && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Fingerprint className="w-5 h-5" />
                Biometric Setup
              </h2>
            </div>
            <div className="card-content">
              <div className="text-center py-8">
                {!fingerprintEnrolled ? (
                  <div className="space-y-6">
                    <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                      <Fingerprint className="w-12 h-12 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">Enroll Fingerprint</h3>
                      <p className="text-slate-400 mb-6">
                        Place the employee's finger on the biometric scanner to enroll their fingerprint.
                      </p>
                      <button
                        type="button"
                        onClick={enrollFingerprint}
                        disabled={isLoading}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Enrolling Fingerprint...
                          </>
                        ) : (
                          <>
                            <Fingerprint className="w-4 h-4 mr-2" />
                            Start Enrollment
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                      <Fingerprint className="w-12 h-12 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">Fingerprint Enrolled Successfully</h3>
                      <p className="text-slate-400">
                        The employee's fingerprint has been successfully enrolled and is ready for attendance tracking.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-800 pt-6">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-3">Employee Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Name:</span>
                      <span className="text-white ml-2">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Employee ID:</span>
                      <span className="text-white ml-2">{formData.empId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Department:</span>
                      <span className="text-white ml-2">{formData.department}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Position:</span>
                      <span className="text-white ml-2">{formData.position}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Join Date:</span>
                      <span className="text-white ml-2">{new Date(formData.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Biometric:</span>
                      <span className={`ml-2 ${fingerprintEnrolled ? 'text-green-400' : 'text-red-400'}`}>
                        {fingerprintEnrolled ? 'Enrolled' : 'Not Enrolled'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary"
              >
                Previous
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Cancel
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating Employee...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Employee
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}