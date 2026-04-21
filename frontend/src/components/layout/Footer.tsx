import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--footer-bg)' }} className="text-white py-16 px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <p className="text-[20px] font-bold tracking-widest">KEFI</p>
            <p className="text-gray-400 text-sm mt-4 max-w-xs leading-relaxed">
              Curated essentials for the modern lifestyle. Quality craftsmanship, timeless design.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#8C8880] font-medium mb-5">Shop</p>
            <ul className="flex flex-col gap-3">
              {['New Arrivals', 'Bestsellers', 'Clothing', 'Accessories'].map(item => (
                <li key={item}>
                  <Link href="/shop" className="text-[16px] text-white hover:text-gray-300 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#8C8880] font-medium mb-5">Company</p>
            <ul className="flex flex-col gap-3">
              {['About', 'Sustainability', 'Careers', 'Press'].map(item => (
                <li key={item}>
                  <Link href="#" className="text-[16px] text-white hover:text-gray-300 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#8C8880] font-medium mb-5">Help</p>
            <ul className="flex flex-col gap-3">
              {['FAQs', 'Shipping', 'Returns', 'Contact'].map(item => (
                <li key={item}>
                  <Link href="#" className="text-[16px] text-white hover:text-gray-300 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
          style={{ borderTop: '1px solid #2a2a2a' }}
        >
          <p className="text-gray-400 text-sm">© 2026 KEFI. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <Link key={item} href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
