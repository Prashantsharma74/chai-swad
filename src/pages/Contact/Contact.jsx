import { useEffect, useState } from 'react'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import Logo from '../../components/Logo/Logo'
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton'
import { getContact } from '../../services/contactService'
import { BRAND } from '../../constants/cafe'
import { usePageTitle } from '../../hooks/usePageTitle'

function digits(value) {
  return String(value || '').replace(/\D/g, '')
}

function withBrandDefaults(contact = {}) {
  return {
    ...contact,
    name: contact.name || BRAND.name,
    phone: contact.phone || BRAND.phone,
    whatsapp: contact.whatsapp || contact.phone || BRAND.phone,
    openingHours: contact.openingHours || BRAND.hours,
    address: contact.address || BRAND.address
  }
}

export default function ContactPage() {
  usePageTitle('Contact')
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      try {
        const next = await getContact()
        if (!ignore) setContact(withBrandDefaults(next))
      } catch {
        if (!ignore) setContact(withBrandDefaults())
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [])

  if (loading) return <LoadingSkeleton variant="orders" />

  const callHref = digits(contact.phone) ? `tel:${digits(contact.phone)}` : ''
  const whatsappHref = digits(contact.whatsapp) ? `https://wa.me/${digits(contact.whatsapp)}` : ''
  const showMap = contact.googleMapsUrl?.includes('/maps/embed')

  const details = [
    ['Address', contact.address],
    ['Phone', contact.phone],
    ['WhatsApp', contact.whatsapp],
    ['Opening hours', contact.openingHours]
  ]

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card px-6 py-8 text-center">
        <Logo className="mx-auto h-20 w-auto max-w-md md:h-24" />
        <h1 className="mt-4 text-3xl font-semibold">{contact.name}</h1>
        <p className="text-terracotta">{BRAND.tagline}</p>
      </div>

      <section className="card mt-4 p-5">
        <dl className="space-y-4">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm font-semibold text-cocoa">{label}</dt>
              <dd className="mt-1 text-lg">{value || 'Not available'}</dd>
            </div>
          ))}
        </dl>
      </section>

      {showMap ? (
        <iframe
          title="Chai Swad on Google Maps"
          src={contact.googleMapsUrl}
          className="mt-4 h-64 w-full rounded-2xl border-0"
          loading="lazy"
        />
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {callHref ? (
          <a className="btn-primary" href={callHref}>
            <Phone className="mr-2 h-4 w-4" />
            Call Now
          </a>
        ) : (
          <span className="btn-secondary opacity-60">Call Now</span>
        )}
        {whatsappHref ? (
          <a className="btn-secondary" href={whatsappHref} target="_blank" rel="noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </a>
        ) : (
          <span className="btn-secondary opacity-60">WhatsApp</span>
        )}
      </div>

      {contact.googleMapsUrl ? (
        <a className="btn-secondary mt-3 w-full" href={contact.googleMapsUrl} target="_blank" rel="noreferrer">
          <MapPin className="mr-2 h-4 w-4" />
          Get Directions
        </a>
      ) : null}

      {contact.email ? (
        <a className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-terracotta" href={`mailto:${contact.email}`}>
          <Mail className="h-4 w-4" />
          {contact.email}
        </a>
      ) : null}
    </div>
  )
}
