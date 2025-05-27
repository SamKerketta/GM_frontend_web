import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { CURRENCY, GYM_NAME } from "../config/utilities";

const Invoice = ({ openModal, setOpenModal }) => {
  return (
    <>
      <Modal size="4xl" show={openModal} onClose={() => setOpenModal(false)}>
        <ModalBody>
          {/* Modal */}
          <div className="relative overflow-hidden min-h-32 bg-gray-900 text-center rounded-t-xl dark:bg-neutral-950">
            {/* Close Button */}
            <div className="absolute top-2 end-2">
              <button
                type="button"
                className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-white/10 text-white hover:bg-white/20 focus:outline-hidden focus:bg-white/20 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => setOpenModal(false)}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            {/* End Close Button */}
            {/* SVG Background Element */}
            <figure className="absolute inset-x-0 bottom-0 -mb-px">
              <svg
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 1920 100.1"
              >
                <path
                  fill="currentColor"
                  className="fill-white dark:fill-neutral-800"
                  d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
                />
              </svg>
            </figure>
            {/* End SVG Background Element */}
          </div>
          {/* Body */}
          <div className="p-4 sm:p-7 overflow-y-auto">
            <div className="text-center">
              <h3
                id="hs-ai-modal-label"
                className="text-lg font-semibold text-gray-800 dark:text-neutral-200"
              >
                {GYM_NAME}
              </h3>
              <p className="text-sm text-gray-500 dark:text-neutral-500">
                Invoice #3682303
              </p>
            </div>
            {/* Grid */}
            <div className="mt-5 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 gap-5">
              <div>
                <span className="block text-xs uppercase text-gray-500 dark:text-neutral-500">
                  Amount paid:
                </span>
                <span className="block text-sm font-medium text-gray-800 dark:text-neutral-200">
                  {CURRENCY}316.8
                </span>
              </div>
              {/* End Col */}
              <div>
                <span className="block text-xs uppercase text-gray-500 dark:text-neutral-500">
                  Date paid:
                </span>
                <span className="block text-sm font-medium text-gray-800 dark:text-neutral-200">
                  April 22, 2020
                </span>
              </div>
              {/* End Col */}
              <div>
                <span className="block text-xs uppercase text-gray-500 dark:text-neutral-500">
                  Payment method:
                </span>
                <div className="flex items-center gap-x-2">
                  <svg
                    className="size-5"
                    width={400}
                    height={248}
                    viewBox="0 0 400 248"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0)">
                      <path d="M254 220.8H146V26.4H254V220.8Z" fill="#FF5F00" />
                      <path
                        d="M152.8 123.6C152.8 84.2 171.2 49 200 26.4C178.2 9.2 151.4 0 123.6 0C55.4 0 0 55.4 0 123.6C0 191.8 55.4 247.2 123.6 247.2C151.4 247.2 178.2 238 200 220.8C171.2 198.2 152.8 163 152.8 123.6Z"
                        fill="#EB001B"
                      />
                      <path
                        d="M400 123.6C400 191.8 344.6 247.2 276.4 247.2C248.6 247.2 221.8 238 200 220.8C228.8 198.2 247.2 163 247.2 123.6C247.2 84.2 228.8 49 200 26.4C221.8 9.2 248.6 0 276.4 0C344.6 0 400 55.4 400 123.6Z"
                        fill="#F79E1B"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0">
                        <rect width={400} height="247.2" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="block text-sm font-medium text-gray-800 dark:text-neutral-200">
                    •••• 4242
                  </span>
                </div>
              </div>
              {/* End Col */}
            </div>
            {/* End Grid */}
            <div className="mt-5 sm:mt-10">
              <h4 className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                Summary
              </h4>
              <ul className="mt-3 flex flex-col">
                <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200">
                  <div className="flex items-center justify-between w-full">
                    <span>Payment to Front</span>
                    <span>{CURRENCY}264.00</span>
                  </div>
                </li>
                <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200">
                  <div className="flex items-center justify-between w-full">
                    <span>Tax fee</span>
                    <span>{CURRENCY}52.8</span>
                  </div>
                </li>
                <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-semibold bg-gray-50 border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200">
                  <div className="flex items-center justify-between w-full">
                    <span>Amount paid</span>
                    <span>{CURRENCY}316.8</span>
                  </div>
                </li>
              </ul>
            </div>
            {/* Button */}
            <div className="mt-5 flex justify-end gap-x-2">
              <a
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                href="#"
              >
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1={12} x2={12} y1={15} y2={3} />
                </svg>
                Invoice PDF
              </a>
              <a
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                href="#"
              >
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect width={12} height={8} x={6} y={14} />
                </svg>
                Print
              </a>
            </div>
            {/* End Buttons */}
            <div className="mt-5 sm:mt-10">
              <p className="text-sm text-gray-500 dark:text-neutral-500">
                If you have any questions, please contact us at{" "}
                <a
                  className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500"
                  href="#"
                >
                  example@site.com
                </a>{" "}
                or call at{" "}
                <a
                  className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500"
                  href="tel:+1898345492"
                >
                  +1 898-34-5492
                </a>
              </p>
            </div>
          </div>
          {/* End Body */}
        </ModalBody>
      </Modal>
    </>
  );
};
export default Invoice;
