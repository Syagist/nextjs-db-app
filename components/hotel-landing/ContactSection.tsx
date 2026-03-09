interface ContactSectionProps {
  name: string
  location: string
  contactEmail: string | null
  contactPhone: string | null
}

export function ContactSection({ name, location, contactEmail, contactPhone }: ContactSectionProps) {
  return (
    <section id="contact" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-500">Get In Touch</p>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Contact & Location</h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Address */}
          <div className="flex flex-col items-start gap-4 rounded-2xl bg-slate-50 p-8 ring-1 ring-slate-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Location</p>
              <p className="mt-1 font-semibold text-slate-900">{name}</p>
              <p className="text-slate-600">{location}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col items-start gap-4 rounded-2xl bg-slate-50 p-8 ring-1 ring-slate-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Telephone</p>
              {contactPhone ? (
                <a
                  href={`tel:${contactPhone}`}
                  className="mt-1 block font-semibold text-slate-900 hover:text-amber-600 transition"
                >
                  {contactPhone}
                </a>
              ) : (
                <p className="mt-1 text-slate-500">Not provided</p>
              )}
              <p className="mt-1 text-sm text-slate-500">Available 24 hours, 7 days a week</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col items-start gap-4 rounded-2xl bg-slate-50 p-8 ring-1 ring-slate-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Email</p>
              {contactEmail ? (
                <a
                  href={`mailto:${contactEmail}`}
                  className="mt-1 block font-semibold text-slate-900 hover:text-amber-600 transition break-all"
                >
                  {contactEmail}
                </a>
              ) : (
                <p className="mt-1 text-slate-500">Not provided</p>
              )}
              <p className="mt-1 text-sm text-slate-500">We reply within 2 business hours</p>
            </div>
          </div>
        </div>

        {/* Hours bar */}
        <div className="mt-8 rounded-2xl bg-slate-900 px-8 py-6">
          <div className="grid gap-4 text-center sm:grid-cols-3">
            {[
              { label: 'Check-in', value: 'From 3:00 PM' },
              { label: 'Check-out', value: 'Until 12:00 PM' },
              { label: 'Front Desk', value: 'Open 24 / 7' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
                <p className="mt-1 font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
