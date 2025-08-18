export default function Footer() {
  return (
    <footer className="mt-16 bg-white border-t">
      <div className="container py-10 text-sm text-gray-600">
        <div>© {new Date().getFullYear()} Winnemac Properties. All rights reserved.</div>
        <div className="mt-2">Chicago • Grand Rapids</div>
      </div>
    </footer>
  );
}
