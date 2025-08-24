import ThemeSwitch from "@/components/theme-switch";
import { SITE_NAME } from "@/constants";

export function Footer() {
  return (
    <footer className="border-t dark:bg-muted/30 bg-muted/60 shadow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="py-6 md:py-8">

          {/* Copyright - Optimized for mobile */}
          <div className="mt-6 pt-6 md:mt-8 md:pt-8 border-t">
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                 © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
              </p>

              <div className="flex flex-col md:flex-row items-center gap-4 md:space-x-4">
                <div className="flex items-center gap-4">
                  <ThemeSwitch />

                  <a
                    href="https://www.linkedin.com/in/klvndsmn/"
                    target="_blank"
                    className="flex items-center font-medium text-sm hover:text-foreground transition-colors"
                  >
                    <span className="whitespace-nowrap">Built by Kelvin Desman</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
