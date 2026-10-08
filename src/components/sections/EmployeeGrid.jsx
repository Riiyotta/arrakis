/* `/about` slot 4 — `employeeGrid`.
   Spec: CLONE_SPEC_SECURITY_ABOUT §4.4.

   ⚠️ This section renders a centred <h2> and LITERALLY NOTHING ELSE. The CMS
   block has no `employees` / `items` / `people` field, so the component
   fetches nothing: the live section is 646 characters of outerHTML with four
   descendants and ZERO <img> at all four viewports. Section height is just
   the h2 plus paddingBottom (248 = 88 + 160 @1440; 129.19 = 57.19 + 72
   @390). Do not add team photos.

   The `gap-y-*` on the flex parent is inert with a single child, and is kept
   only for structural parity with the original. `max-w-124` in the original
   is Tailwind v4's spacing scale → 496px, written as a literal here. */

import { EMPLOYEE_GRID } from '../../data/about'

export default function EmployeeGrid() {
  return (
    <section className="relative overflow-clip bg-black pt-0 pb-18 text-white md:pb-28 lg:pb-40">
      <div className="container relative z-1 flex flex-col gap-y-0">
        <div>
          <div className="flex flex-col items-center gap-y-14 md:gap-y-18 lg:gap-y-30">
            <h2 className="text-heading-40 max-w-[31rem] text-center text-balance">
              {EMPLOYEE_GRID.heading}
            </h2>
          </div>
        </div>
      </div>
    </section>
  )
}
