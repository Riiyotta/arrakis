import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from './Button'
import MegaMenu, { DOT_TRANSITION } from './MegaMenu'
import MobileDrawer from './MobileDrawer'

/* Header (spec §4.0), scroll state (§6.1), mega-menu open/close (§6.9).
   Scrolled header is shadowless (§2.7): `box-shadow` resolves to transparent layers.

   Three states, not two (the third was measured on the live site, it is not in the spec):
     1. top          — bg #0F0C0B, all nav text white, height var(--header-height)
     2. scrolled     — bg #FFF, height 64px                  (scrollY > 300)
     3. menu open    — bg #FFF, height UNCHANGED at var(--header-height), independent of scroll
   The light appearance is driven by `scrolled || menuOpen`; only `scrolled` collapses the height.
   In any light state the active trigger is `night` and every inactive trigger/link is `stroke-2`. */

/* Wordmark: 102 × 25 inline SVG, single path, currentColor-driven — copied verbatim
   out of the saved page (§7.7). */
const LOGO_PATH = 'M89.3478 16.1899L89.345 16.1872L89.3684 11.8768C89.3684 10.3567 89.4948 8.78564 89.4454 7.06755C89.4687 6.64284 89.2694 6.29372 88.7485 6.29372H85.8099V7.01807C87.3548 7.194 87.3809 7.46614 87.3809 9.93333L87.3575 15.9412C87.3575 17.6854 87.1087 17.8104 85.9858 17.9342V18.631H90.7209V17.9342C89.3753 17.8077 89.3492 17.5589 89.3492 16.1899H89.3478ZM83.2808 16.4772L83.2836 16.4855L78.598 9.6818C79.6935 8.41041 81.0652 7.56373 82.4603 7.56373C83.2575 7.56373 83.4568 7.83863 83.6327 8.65919H84.3296V7.13902C84.3296 6.36519 84.0052 6.06694 82.885 6.06694C79.6206 6.06694 76.8043 8.83375 75.6827 11.6487L75.7088 6.54112C75.7088 5.09655 75.7583 4.35846 75.7844 2.26513C75.7611 1.79094 75.6085 1.46794 75.0876 1.46794L72.1462 1.54078V2.23764C73.5908 2.41357 73.7406 1.59027 73.7172 5.42918V15.9315C73.7172 17.6757 73.4423 17.8008 72.3455 17.9245V18.6214H77.0545V17.9245C75.7088 17.7981 75.6827 17.5493 75.6827 16.1803V15.6058C75.7089 14.2602 76.3562 12.5902 77.3761 11.1195L81.1889 16.6256C81.9366 17.6977 81.7373 17.8709 80.6638 17.9713V18.6186H85.0512V17.9218C84.3268 17.7953 83.7798 17.1741 83.2808 16.4772ZM98.1417 11.8026V11.7999L95.5508 10.9766C94.4553 10.6274 94.0306 10.1532 94.0306 9.2832C94.0045 7.88811 95.2525 7.24073 96.7699 7.24073C98.6887 7.24073 99.6357 8.06404 99.7855 9.53198H100.533V7.83863C100.533 6.96584 100.258 6.71569 99.5862 6.44354C99.0117 6.21813 97.8654 5.99546 96.7205 5.99546C94.3028 5.99546 92.1105 7.04144 92.1105 9.48526C92.1105 11.2047 93.0575 12.1517 94.777 12.7001L97.2441 13.474C98.466 13.8492 98.9883 14.4471 98.9883 15.5659C98.9883 16.8868 97.8929 17.7074 96.1487 17.7074C94.2052 17.7074 92.6589 16.9102 92.4857 14.5419H91.7613V16.4855C91.7613 17.3088 92.1366 17.7074 92.5352 18.007C93.0602 18.3822 94.3783 18.9306 96.2243 18.9306C99.266 18.9306 101.06 17.585 101.083 15.2182C101.083 13.2747 99.9601 12.3785 98.1403 11.804L98.1417 11.8026ZM88.196 4.4588H88.1987C89.0454 4.4588 89.6433 3.83478 89.6433 2.98811C89.6199 2.1648 89.0193 1.54353 88.1726 1.54353C87.3259 1.54353 86.728 2.16755 86.7514 2.98811C86.7514 3.83478 87.3754 4.4588 88.196 4.4588ZM38.9801 16.1858H38.9774V9.95532C38.9774 6.84076 37.1576 6.01745 34.0925 6.01745C32.472 6.01745 30.9546 6.36657 30.4034 6.61535C30.0776 6.7418 29.9058 6.99058 29.9058 7.36306V9.15675H30.6302C30.8295 7.862 31.8755 7.36306 33.9207 7.36306C36.2889 7.36306 36.9596 8.05992 36.9624 9.90309V10.0529C31.2569 10.4281 28.6894 12.1943 28.6894 15.2594C28.6894 17.5768 30.3828 18.899 32.8266 18.899C34.9955 18.899 36.3398 17.8764 36.9885 16.5074V17.7294C36.9885 18.3273 37.3376 18.6255 37.9355 18.6255H40.3271V17.9287C39.0049 17.8022 38.9815 17.5534 38.9815 16.1844L38.9801 16.1858ZM37.251 13.2939C37.2249 15.834 35.6305 17.5053 33.5619 17.5053C32.0913 17.5053 30.9711 16.682 30.9944 15.0876C30.9711 12.9187 32.7647 11.6473 37.251 11.2487V13.2939ZM70.0474 16.1858H70.0446V9.95532C70.0446 6.84076 68.2248 6.01745 65.1598 6.01745C63.5392 6.01745 62.0191 6.36657 61.4707 6.61535C61.1449 6.7418 60.9717 6.99058 60.9717 7.36306V9.15675H61.6961C61.8954 7.862 62.9414 7.36306 64.9866 7.36306C67.3548 7.36306 68.0283 8.05992 68.0283 9.90309V10.0529C62.3201 10.4281 59.7567 12.1943 59.7567 15.2594C59.7567 17.5768 61.45 18.899 63.8939 18.899C66.0628 18.899 67.407 17.8764 68.0544 16.5074V17.7294C68.0544 18.3273 68.4035 18.6255 69.0014 18.6255H71.393V17.9287C70.0708 17.8022 70.0474 17.5534 70.0474 16.1844V16.1858ZM68.0269 13.2939C68.0008 15.834 66.4064 17.5053 64.3378 17.5053C62.8671 17.5053 61.7469 16.682 61.7703 15.0876C61.7442 12.9187 63.5406 11.6473 68.0269 11.2487V13.2939ZM48.4283 6.09442V6.09168C46.5095 6.09168 45.1144 7.2641 44.5165 8.90797V6.68957C44.5399 6.41742 44.3406 6.29097 44.1908 6.29097H41.0762V7.01532C42.6211 7.19125 42.6472 7.4634 42.6472 9.93058V15.9384C42.6211 17.6812 42.3723 17.8077 41.2755 17.9314V18.6283H46.2841V17.9314C44.6636 17.8049 44.6402 17.5562 44.6141 16.1872L44.5907 11.9263C44.6911 9.98418 45.7632 7.78915 47.6324 7.78915C48.4791 7.78915 48.7279 8.13826 48.8777 8.86124L49.6021 8.83787V7.01807C49.6021 6.44354 49.5017 6.09442 48.4296 6.09442H48.4283ZM20.7065 3.61899C20.6831 3.5915 20.6584 3.56401 20.6323 3.53927C20.6061 3.51316 20.5786 3.48841 20.5512 3.46505C20.5388 3.45405 20.5264 3.44306 20.514 3.43206C18.2448 1.22053 15.2512 0 12.0871 0C8.92309 0 5.92949 1.21916 3.65748 3.43344C3.64786 3.44306 3.63549 3.45405 3.62174 3.46505C3.59425 3.48979 3.56676 3.51316 3.54065 3.53927C3.51453 3.56539 3.49117 3.59287 3.46643 3.61899C3.45543 3.63136 3.44444 3.64373 3.43207 3.65748C1.21916 5.92673 0 8.92034 0 12.0844C0 15.2484 1.21916 18.242 3.43481 20.514C3.44306 20.5237 3.45543 20.536 3.46643 20.5498C3.48979 20.5773 3.51453 20.6048 3.54065 20.6295C3.56676 20.6556 3.59425 20.679 3.62174 20.7037C3.63411 20.7147 3.64648 20.7257 3.66023 20.7381C5.92949 22.9496 8.92309 24.1701 12.0871 24.1701C15.2512 24.1701 18.2448 22.951 20.5168 20.7367C20.5264 20.7285 20.5388 20.7175 20.5512 20.7065C20.5786 20.6817 20.6061 20.6584 20.6323 20.6322C20.6584 20.6061 20.6817 20.5786 20.7065 20.5525C20.7175 20.5402 20.7285 20.5278 20.7408 20.514C22.9537 18.2448 24.1729 15.2512 24.1729 12.0871C24.1729 8.92309 22.9537 5.92948 20.7381 3.65748C20.7298 3.64786 20.7175 3.63548 20.7065 3.62174V3.61899ZM19.8351 4.18528C19.89 4.23888 19.9464 4.29523 20.0027 4.35296C20.8412 5.28898 20.9209 6.9246 20.2213 8.9547C19.9821 9.65019 19.655 10.3759 19.2482 11.1126C18.4551 9.93883 17.5122 8.80076 16.4401 7.73005C15.6814 6.97134 14.8801 6.2676 14.0581 5.64084C13.8423 5.47591 13.731 5.21613 13.7626 4.94536C13.7929 4.68146 13.955 4.46017 14.197 4.35158C14.5406 4.19764 14.8842 4.06157 15.2168 3.94749C16.1308 3.63273 16.9679 3.47329 17.7032 3.47329C18.6022 3.47329 19.3196 3.71246 19.8351 4.18253V4.18528ZM18.341 12.0844C18.341 12.4198 18.2365 12.7414 18.0386 13.0149C17.3624 13.9509 16.583 14.8608 15.724 15.7212C15.1247 16.3205 14.4952 16.8854 13.8533 17.4009C13.3558 17.7994 12.729 18.0194 12.0885 18.0194C11.448 18.0194 10.8212 17.7994 10.3237 17.4009C9.6818 16.8868 9.05229 16.3219 8.45302 15.7212C7.5926 14.8608 6.81465 13.9509 6.13841 13.0149C5.94048 12.7414 5.83602 12.4198 5.83602 12.0844C5.83602 11.749 5.94048 11.4274 6.13841 11.1539C6.81465 10.2178 7.59398 9.30794 8.45302 8.44752C9.05229 7.84825 9.6818 7.28334 10.3237 6.76791C10.8212 6.36932 11.448 6.1494 12.0885 6.1494C12.729 6.1494 13.3558 6.36932 13.8533 6.76791C14.4952 7.28334 15.1247 7.84825 15.724 8.44752C16.5844 9.30794 17.3624 10.2178 18.0386 11.1539C18.2365 11.4274 18.341 11.749 18.341 12.0844ZM7.76441 1.89402C9.13476 1.30987 10.589 1.01436 12.0871 1.01436C13.5853 1.01436 15.0409 1.30987 16.4099 1.89402C16.5954 1.97374 16.6476 2.14281 16.6325 2.27475C16.6188 2.40258 16.5308 2.56477 16.3288 2.60326C15.8669 2.69122 15.3818 2.82179 14.8856 2.99223C13.9798 3.30423 13.0383 3.74819 12.0871 4.31173C11.136 3.74819 10.1945 3.30423 9.2887 2.99223C8.79252 2.82179 8.30733 2.69122 7.84551 2.60326C7.64346 2.56477 7.55549 2.40258 7.54175 2.27475C7.528 2.14281 7.57886 1.97374 7.76441 1.89402ZM4.17566 4.35021C4.22926 4.29523 4.28561 4.23888 4.34334 4.18253C4.8574 3.71521 5.57487 3.47604 6.47241 3.47604C7.20775 3.47604 8.04481 3.63549 8.95883 3.95024C9.29145 4.06432 9.6337 4.2004 9.97869 4.35434C10.2206 4.46155 10.3828 4.68421 10.413 4.94673C10.4446 5.21613 10.3347 5.47591 10.1175 5.64222C9.29558 6.26898 8.49426 6.97134 7.73555 7.73142C6.66483 8.80214 5.72057 9.9402 4.9275 11.114C4.52065 10.3773 4.19352 9.65156 3.95437 8.95608C3.25613 6.9246 3.33448 5.28898 4.17566 4.35021ZM2.99361 14.8828C2.82317 15.379 2.6926 15.8642 2.60463 16.326C2.56477 16.5377 2.39021 16.6325 2.23352 16.6325C2.07683 16.6325 1.95588 16.5487 1.8954 16.4071C1.31125 15.0368 1.01574 13.5826 1.01574 12.083C1.01574 10.5835 1.31125 9.12927 1.8954 7.75891C1.95588 7.61734 2.08233 7.5335 2.23352 7.5335C2.38884 7.5335 2.56477 7.62833 2.60463 7.84C2.6926 8.30183 2.82317 8.78839 2.99361 9.2832C3.22314 9.9512 3.52691 10.6426 3.89526 11.3394C4.01622 11.5676 4.07944 11.8246 4.07944 12.083C4.07944 12.3414 4.01484 12.5984 3.89389 12.8266C3.52553 13.5235 3.22177 14.2148 2.99223 14.8828H2.99361ZM4.33922 19.9835C4.28424 19.9299 4.22789 19.8735 4.17153 19.8158C3.3331 18.8798 3.25338 17.2442 3.95299 15.2141C4.19215 14.5186 4.51928 13.7929 4.92612 13.0561C5.71919 14.2299 6.66208 15.368 7.73417 16.4387C8.49288 17.1974 9.2942 17.9012 10.1161 18.5279C10.3319 18.6929 10.4433 18.9526 10.4117 19.2234C10.3814 19.4873 10.2192 19.7086 9.97732 19.8158C9.6337 19.9697 9.29008 20.1058 8.95746 20.2199C8.04343 20.5347 7.20637 20.6941 6.47103 20.6941C5.57212 20.6941 4.85465 20.4549 4.33922 19.9849V19.9835ZM16.4099 22.2747C15.0395 22.8589 13.5853 23.1544 12.0871 23.1544C10.589 23.1544 9.13476 22.8589 7.76441 22.2747C7.57886 22.195 7.52663 22.026 7.54175 21.894C7.55549 21.7662 7.64346 21.604 7.84551 21.5655C8.30733 21.4775 8.79389 21.347 9.2887 21.1765C10.1945 20.8645 11.136 20.4206 12.0871 19.857C13.0383 20.4206 13.9798 20.8645 14.8856 21.1765C15.3818 21.347 15.8669 21.4775 16.3288 21.5655C16.5308 21.604 16.6188 21.7662 16.6325 21.894C16.6463 22.026 16.5954 22.195 16.4099 22.2747ZM19.9986 19.8186C19.945 19.8735 19.8887 19.9299 19.8309 19.9862C19.3169 20.4536 18.5994 20.6927 17.7019 20.6927C16.9665 20.6927 16.1295 20.5333 15.2154 20.2185C14.8828 20.1044 14.5406 19.9684 14.1956 19.8144C13.9537 19.7072 13.7915 19.4846 13.7612 19.2207C13.7296 18.9513 13.841 18.6915 14.0568 18.5252C14.8787 17.8984 15.68 17.1947 16.4387 16.436C17.5094 15.3653 18.4537 14.2272 19.2468 13.0534C19.6536 13.7901 19.9794 14.5158 20.2199 15.2113C20.9181 17.2428 20.8398 18.8784 19.9972 19.8172L19.9986 19.8186ZM21.5696 7.84138C21.6095 7.62971 21.7841 7.53487 21.9408 7.53487C22.0919 7.53487 22.2184 7.61871 22.2789 7.76028C22.863 9.13063 23.1585 10.5848 23.1585 12.0844C23.1585 13.5839 22.863 15.0381 22.2789 16.4085C22.2184 16.5501 22.0919 16.6339 21.9408 16.6339C21.7896 16.6339 21.6095 16.5391 21.5696 16.3274C21.4817 15.8656 21.3511 15.379 21.1807 14.8842C20.9511 14.2176 20.6474 13.5248 20.279 12.828C20.1581 12.5998 20.0935 12.3428 20.0935 12.0844C20.0935 11.826 20.1567 11.569 20.279 11.3408C20.6474 10.6439 20.9511 9.95257 21.1807 9.28458C21.3511 8.78839 21.4817 8.3032 21.5696 7.84138ZM57.996 6.09442V6.09168C56.0772 6.09168 54.6821 7.2641 54.0842 8.90797V6.68957C54.1076 6.41742 53.9083 6.29097 53.7585 6.29097H50.6439V7.01532C52.1888 7.19125 52.2149 7.4634 52.2149 9.93058V15.9384C52.1916 17.6812 51.94 17.8077 50.8432 17.9314V18.6283H55.8518V17.9314C54.2313 17.8049 54.2079 17.5562 54.1818 16.1872L54.1585 11.9263C54.2574 9.98418 55.3309 7.78915 57.2002 7.78915C58.0468 7.78915 58.2956 8.13826 58.4454 8.86124L59.1698 8.83787V7.01807C59.1698 6.44354 59.0695 6.09442 57.9974 6.09442H57.996Z'

const NAV = [
  { label: 'Platform', type: 'menu', index: 0 },
  { label: 'Industries', type: 'menu', index: 1 },
  { label: 'Security', type: 'link', href: '/security' },
  { label: 'About', type: 'link', href: '/about' },
]

export default function Header({ theme = 'dark' }) {
  /* The homepage header starts dark and inverts on scroll. Every pageBuilder
     route (the six industry pages) ships `headerTheme: "white"`, so it starts
     light, never inverts, and its nav colour is static — only the height and
     the box-shadow animate. Those routes also get a real `shadow-md` when
     scrolled, unlike the homepage whose shadow computes to transparent. */
  const whiteTheme = theme === 'white'

  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  /* §6.1 threshold: window.scrollY > 300 (300 = black, 301 = white) */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setOpenMenu(null)
      setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const toggleDrawer = () => {
    setDrawerOpen((v) => !v)
    setOpenMenu(null)
  }

  const menuOpen = openMenu !== null
  /* light appearance = white theme OR scrolled OR mega-menu open;
     height collapse = scrolled only */
  const light = whiteTheme || scrolled || menuOpen

  /* measured: active trigger → night, every inactive trigger/link → stroke-2 */
  const navColor = (isActive) =>
    light ? (isActive ? 'text-night' : 'text-stroke-2') : 'text-white'

  return (
    <header
      data-header-root="true"
      onMouseLeave={() => setOpenMenu(null)}
      className={`sticky inset-x-0 top-0 z-50 transition-[background-color,box-shadow,height] ${
        light ? 'bg-white text-night' : 'bg-black text-white'
      } ${scrolled ? 'h-16' : 'h-[var(--header-height)]'} ${
        whiteTheme && scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="relative z-[5] container flex size-full items-center justify-between gap-x-12 py-3">
        <div className="flex flex-1 items-center gap-x-16">
          <a
            aria-label="Home"
            href="/"
            className={`block w-[6.375rem] shrink-0 transition-colors ${
              light ? 'text-night' : 'text-white'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 102 25"
              fill="none"
            >
              <path d={LOGO_PATH} fill="currentColor" />
            </svg>
          </a>

          {/* desktop nav: lg+ only, 48px right padding per item except the last */}
          <div className="hidden items-center lg:flex">
            {NAV.map((item, i) => {
              const pr = i === NAV.length - 1 ? '' : 'pr-12'
              if (item.type === 'link') {
                return (
                  <div key={item.label} className={`cursor-pointer ${pr}`}>
                    <div className="relative">
                      <a
                        className={`text-nav-link inline-block py-1 transition-colors ${navColor(
                          false,
                        )}`}
                        href={item.href}
                        onMouseEnter={() => setOpenMenu(null)}
                      >
                        {item.label}
                      </a>
                    </div>
                  </div>
                )
              }
              const isOpen = openMenu === item.index
              return (
                <div
                  key={item.label}
                  className={`cursor-pointer transition-colors ${pr} ${navColor(isOpen)}`}
                  onMouseEnter={() => setOpenMenu(item.index)}
                >
                  <div className="relative">
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      aria-controls={`header-submenu-${item.index}`}
                      onClick={() => setOpenMenu(isOpen ? null : item.index)}
                      className="text-nav-link cursor-pointer"
                    >
                      {item.label}
                    </button>
                    {/* 6px sun dot, 8px below the trigger, fades in with the panel */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          className="bg-sun absolute top-[calc(100%+0.5rem)] left-1/2 size-1.5 -translate-x-1/2 rounded-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={DOT_TRANSITION}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-x-6">
          <a className="max-lg:hidden" href="mailto:demo@arrakis.tech">
            <Button as="div" variant={light ? 'scrolled' : 'dark'}>
              Request a demo
            </Button>
          </a>

          {/* burger: below lg only. The two 1px bars keep their transform-origin classes so the
              motion pass can rotate them into an X. */}
          <button
            type="button"
            aria-expanded={drawerOpen}
            aria-controls="mobile-navigation"
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            onClick={toggleDrawer}
            className="relative z-[100] flex h-7 cursor-pointer items-center gap-x-0.5 focus:border-none focus:ring-0 focus:outline-none lg:hidden"
          >
            <span className="square-bracket-burger-border-l text-stroke-3" />
            <svg
              className="overflow-visible will-change-transform"
              width="18"
              height="8.5"
              viewBox="0 0 18 8.5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 0H18V1.25H0Z"
                fill="currentColor"
                className="origin-[9px_0.625px] will-change-transform"
                style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
              />
              <path
                d="M0 7.25H18V8.5H0Z"
                fill="currentColor"
                className="origin-[9px_7.875px] will-change-transform"
                style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
              />
            </svg>
            <span className="square-bracket-burger-border-r text-stroke-3" />
          </button>
        </div>
      </div>

      <MobileDrawer open={drawerOpen} />

      {/* panel is lazy-mounted: #header-submenu-N is absent from the DOM when closed (measured) */}
      <AnimatePresence>
        {menuOpen && <MegaMenu key={openMenu} index={openMenu} />}
      </AnimatePresence>
    </header>
  )
}
