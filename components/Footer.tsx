export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="container py-10 text-sm text-gray-600">
        <div>© {new Date().getFullYear()} Winnemac Properties. All rights reserved.</div>
        <div className="mt-2">Chicago • Grand Rapids</div>
      </div>
    </footer>
  );
}
