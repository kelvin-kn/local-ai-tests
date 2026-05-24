import { useState } from 'react'

function Contact() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  // Validation errors per field
  const [errors, setErrors] = useState({})
  // Success message state
  const [submitted, setSubmitted] = useState(false)

  // Validate form fields
  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      setSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
      // Auto-dismiss success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    }
  }

  // Update form field on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  return (
    <section id="contact" className="py-24 lg:py-32 px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="text-xs tracking-widest uppercase text-neutral-400 font-mono-editorial mb-4">
          04 — Contact
        </p>

        {/* Section title */}
        <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 dark:text-neutral-100 mb-4">
          Get In Touch
        </h2>

        {/* Subtitle */}
        <p className="text-neutral-500 dark:text-neutral-500 mb-16 max-w-xl text-[15px] leading-relaxed">
          Have a project in mind or just want to chat? I'm always open to 
          discussing new opportunities and ideas.
        </p>

        {/* Success message */}
        {submitted && (
          <div className="mb-8 p-4 border border-[#c4724e]/30 bg-[#c4724e]/5 text-[#c4724e] text-sm font-mono-editorial">
            Message sent successfully. I'll get back to you soon.
          </div>
        )}

        {/* Contact form */}
        <form onSubmit={handleSubmit} className="max-w-xl space-y-8">
          {/* Name field */}
          <div>
            <label htmlFor="name" className="block text-xs tracking-widest uppercase text-neutral-500 dark:text-neutral-500 font-mono-editorial mb-3">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full bg-transparent border-b ${
                errors.name ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
              } pb-2 text-neutral-900 dark:text-neutral-100 font-mono-editorial text-sm focus:outline-none focus:border-[#c4724e] transition-colors placeholder-neutral-300 dark:placeholder-neutral-700`}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-2 text-xs text-red-500 font-mono-editorial">{errors.name}</p>
            )}
          </div>

          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-xs tracking-widest uppercase text-neutral-500 dark:text-neutral-500 font-mono-editorial mb-3">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-transparent border-b ${
                errors.email ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
              } pb-2 text-neutral-900 dark:text-neutral-100 font-mono-editorial text-sm focus:outline-none focus:border-[#c4724e] transition-colors placeholder-neutral-300 dark:placeholder-neutral-700`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-2 text-xs text-red-500 font-mono-editorial">{errors.email}</p>
            )}
          </div>

          {/* Message field */}
          <div>
            <label htmlFor="message" className="block text-xs tracking-widest uppercase text-neutral-500 dark:text-neutral-500 font-mono-editorial mb-3">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className={`w-full bg-transparent border-b ${
                errors.message ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
              } pb-2 text-neutral-900 dark:text-neutral-100 font-mono-editorial text-sm focus:outline-none focus:border-[#c4724e] transition-colors resize-none placeholder-neutral-300 dark:placeholder-neutral-700`}
              placeholder="Tell me about your project..."
            />
            {errors.message && (
              <p className="mt-2 text-xs text-red-500 font-mono-editorial">{errors.message}</p>
            )}
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              className="inline-flex items-center gap-3 px-8 py-3 bg-[#c4724e] text-white text-xs tracking-widest uppercase font-mono-editorial hover:bg-[#a85e3f] transition-colors"
            >
              Send Message
              <span>→</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Contact
