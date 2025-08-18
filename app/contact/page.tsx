export default function ContactPage() {
  return (
    <section className="container py-12">
      <h1 className="text-3xl font-semibold mb-4">Contact</h1>
      <form className="grid md:grid-cols-2 gap-4 max-w-3xl">
        <input className="border rounded-xl px-4 py-3" name="name" placeholder="Full Name" required />
        <input className="border rounded-xl px-4 py-3" name="email" placeholder="Email" type="email" required />
        <input className="border rounded-xl px-4 py-3 md:col-span-2" name="subject" placeholder="Subject" />
        <textarea className="border rounded-xl px-4 py-3 md:col-span-2" rows={6} name="message" placeholder="How can we help?" />
        <button className="px-5 py-3 rounded-xl border md:col-span-2 w-max">Send</button>
      </form>
      <div className="mt-6 text-gray-600">
        Or email us at <a className="underline" href="mailto:info@winnemacproperties.com">info@winnemacproperties.com</a>.
      </div>
    </section>
  );
}
