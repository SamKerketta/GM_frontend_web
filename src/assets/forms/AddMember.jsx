import { faUser } from "@fortawesome/free-solid-svg-icons/faUser"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import 'flowbite';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useState } from "react";

const AddMember = ({ openMemberModal, setOpenMemberModal }) => {
    return (
        <>
            {/* Main modal */}
            <div id="member-modal" tabIndex={-1} aria-hidden="true" className="inset-0 bg-gray-900 bg-opacity-50 hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <Modal
                    show={openMemberModal}
                    onClose={() => {
                        setOpenMemberModal(false);
                    }}
                >
                    <ModalHeader>
                        <FontAwesomeIcon icon={faUser} />  Add Member
                    </ModalHeader>
                    <ModalBody>
                        {/* Modal content */}
                        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                            <div className="p-4 md:p-5">
                                <form className="space-y-4" action="#">
                                    <div class="grid grid-cols-12 gap-4">
                                        <div className="col-span-6">
                                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                            <input type="name" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
                                        </div>
                                        <div className="col-span-6">
                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                            <input type="email" name="email" id="email" placeholder="example@gmail.com" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                        </div>
                                        <div className="col-span-6">
                                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mobile</label>
                                            <input type="text" name="phone" id="phone" placeholder="0123456789" maxLength={10} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                        </div>
                                        <div className="col-span-6">
                                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date of Birth</label>
                                            <input type="date" name="dob" id="dob" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                        </div>
                                        <div className="col-span-6">
                                            <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender</label>
                                            <select name="gender" id="gender" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                                                <option value=""></option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </select>
                                        </div>
                                        <div className="col-span-6">
                                            <label htmlFor="planId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Plan</label>
                                            <select name="planId" id="planId" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                                                <option value="">Select Plan</option>
                                                <option value="Monthly">Monthly</option>
                                            </select>
                                        </div>
                                        <div className="col-span-12">
                                            <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                                            <textarea name="address" id="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>

                                            </textarea>
                                        </div>

                                        <div className="col-span-6">
                                            <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Membership Starting Date</label>
                                            <input type="date" name="startDate" id="startDate" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                        </div>

                                        <div className="col-span-6">
                                            <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Membership Ending Date</label>
                                            <input type="date" name="endDate" id="endDate" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </ModalBody>

                    <div class="grid grid-cols-12 gap-4">
                        <ModalFooter className="col-span-12">
                            <Button onClick={() => alert("Processing .....")}><FontAwesomeIcon icon={faUser} />  Save Member</Button>
                            <Button color="gray" onClick={() => setOpenMemberModal(false)}>
                                Decline
                            </Button>
                        </ModalFooter>
                    </div>
                </Modal>
            </div >
        </>
    )
}

export default AddMember