import { faUser } from "@fortawesome/free-solid-svg-icons/faUser"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import 'flowbite';
import { Button, HelperText, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import { CURRENT_DATE } from "../../config/utilities";

const AddMember = ({ openMemberModal, setOpenMemberModal }) => {
    const currentDate = CURRENT_DATE;
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            dob: '',
            gender: '',
            planId: '',
            address: '',
            startDate: '',
            endDate: '',

        },
        validationSchema: Yup.object({
            name: Yup.string()
                .max(25, 'Must be 25 characters or less')
                .required('Please Enter This Field'),
            email: Yup.string()
                .email('Invalid Email Address')
                .max(25, 'Must be 25 characters or less')
                .required('Please Enter This Field'),
            phone: Yup.string()
                .matches(/^[0-9]{10}$/, 'Phone number must be Valid Number')
                .required('Please Enter This Field'),
            dob: Yup.date()
                .max(new Date(), 'Date Range can not be in future')
                .required('Please Enter Date Of Birth'),
            gender: Yup.string()
                .oneOf(['male', 'female'], 'Gender must be either "Male" or "Female"')
                .required('Please Enter This Field'),
            planId: Yup.number()
                .typeError('Plan ID must be a number')   // handles string inputs like "abc"
                .integer('Plan ID must be an integer')
                .required('Please Enter This Field'),
            address: Yup.string()
                .max(100, 'Must be 100 characters or less')
                .required('Please Enter This Field'),
            startDate: Yup.date()
                .required('Please Enter This Field'),
        }),
        onSubmit: (values, { resetForm }) => {
            console.log(values);
            resetForm();
        }
    });

    useEffect(() => {
        if (formik.values.startDate) {
            const addMonths = 1;                            // Do here dynamication as per plan
            const start = new Date(formik.values.startDate);
            const laterDate = new Date(start.setMonth(start.getMonth() + addMonths));
            const formattedlaterDate = laterDate.toISOString().split('T')[0];
            formik.setFieldValue('endDate', formattedlaterDate);
        }
    }, [formik.values.startDate, formik.values.planId])

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
                    <form onSubmit={formik.handleSubmit}>
                        <ModalHeader>
                            <FontAwesomeIcon icon={faUser} />  Add Member
                        </ModalHeader>
                        <ModalBody>
                            {/* Modal content */}
                            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                                <div className="p-4 md:p-5">
                                    <div class="grid grid-cols-12 gap-4">
                                        <div className="col-span-6">
                                            <label htmlFor="name"
                                                className={`block mb-2 text-sm font-medium
                                                ${formik.touched.name && formik.errors.name
                                                        ? 'text-red-900'
                                                        : 'text-gray-900 dark:text-white'}
                                                    `}>
                                                Name
                                            </label>
                                            <input type="name" name="name" id="name"
                                                className={`border text-sm rounded-lg block w-full p-2.5
                                                ${formik.touched.name && formik.errors.name
                                                        ? 'bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white'
                                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'}
                                                    `}
                                                placeholder="Member's Name"
                                                onChange={formik.handleChange}
                                                value={formik.values.name}
                                                color="failure" />
                                            {formik.touched.name && formik.errors.name ?
                                                <div className="mt-2 text-sm text-red-600 dark:text-red-500"><span className="font-medium">
                                                    {formik.errors.name}
                                                </span></div>
                                                : null}
                                        </div>
                                        <div className="col-span-6">
                                            <label htmlFor="email"
                                                className={`block mb-2 text-sm font-medium
                                                ${formik.touched.email && formik.errors.email
                                                        ? 'text-red-900'
                                                        : 'text-gray-900 dark:text-white'}
                                                    `}
                                            >Email</label>
                                            <input type="email" name="email" id="email" placeholder="example@gmail.com"
                                                className={`border text-sm rounded-lg block w-full p-2.5
                                                ${formik.touched.email && formik.errors.email
                                                        ? 'bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white'
                                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'}
                                                    `}
                                                onChange={formik.handleChange}
                                                value={formik.values.email} />
                                            {formik.touched.email && formik.errors.email ?
                                                <div className="mt-2 text-sm text-red-600 dark:text-red-500"><span className="font-medium">
                                                    {formik.errors.email}
                                                </span></div>
                                                : null}
                                        </div>
                                        <div className="col-span-6">
                                            <label htmlFor="phone"
                                                className={`block mb-2 text-sm font-medium
                                                ${formik.touched.phone && formik.errors.phone
                                                        ? 'text-red-900'
                                                        : 'text-gray-900 dark:text-white'}
                                                    `}
                                            >Mobile</label>
                                            <input type="text" name="phone" id="phone" placeholder="0123456789"
                                                className={`border text-sm rounded-lg block w-full p-2.5
                                                ${formik.touched.phone && formik.errors.phone
                                                        ? 'bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white'
                                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'}
                                                    `}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.phone} />
                                            {formik.touched.phone && formik.errors.phone ?
                                                <div className="mt-2 text-sm text-red-600 dark:text-red-500"><span className="font-medium">
                                                    {formik.errors.phone}
                                                </span></div>
                                                : null}
                                        </div>
                                        <div className="col-span-6">
                                            <label htmlFor="dob"
                                                className={`block mb-2 text-sm font-medium
                                                ${formik.touched.dob && formik.errors.dob
                                                        ? 'text-red-900'
                                                        : 'text-gray-900 dark:text-white'}
                                                    `}
                                            >
                                                Date of Birth</label>
                                            <input type="date" name="dob" id="dob"
                                                className={`border text-sm rounded-lg block w-full p-2.5
                                                ${formik.touched.dob && formik.errors.dob
                                                        ? 'bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white'
                                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'}
                                                    `}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                max={currentDate}
                                                value={formik.values.dob} />
                                            {formik.touched.dob && formik.errors.dob ?
                                                <div className="mt-2 text-sm text-red-600 dark:text-red-500"><span className="font-medium">
                                                    {formik.errors.dob}
                                                </span></div>
                                                : null}
                                        </div>
                                        <div className="col-span-6">
                                            <label htmlFor="gender"
                                                className={`block mb-2 text-sm font-medium
                                                ${formik.touched.gender && formik.errors.gender
                                                        ? 'text-red-900'
                                                        : 'text-gray-900 dark:text-white'}
                                                    `}
                                            >Gender</label>
                                            <select name="gender" id="gender"
                                                className={`border text-sm rounded-lg block w-full p-2.5
                                                ${formik.touched.gender && formik.errors.gender
                                                        ? 'bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white'
                                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'}
                                                    `}
                                                onChange={formik.handleChange}
                                                value={formik.values.gender}
                                                onBlur={formik.handleBlur}>
                                                <option value=""></option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </select>
                                            {formik.touched.gender && formik.errors.gender ?
                                                <div className="mt-2 text-sm text-red-600 dark:text-red-500"><span className="font-medium">
                                                    {formik.errors.gender}
                                                </span></div>
                                                : null}
                                        </div>
                                        <div className="col-span-6">
                                            <label htmlFor="planId"
                                                className={`block mb-2 text-sm font-medium
                                                ${formik.touched.planId && formik.errors.planId
                                                        ? 'text-red-900'
                                                        : 'text-gray-900 dark:text-white'}
                                                    `}
                                            >Select Plan</label>
                                            <select name="planId" id="planId"
                                                className={`border text-sm rounded-lg block w-full p-2.5
                                                ${formik.touched.planId && formik.errors.planId
                                                        ? 'bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white'
                                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'}
                                                    `}
                                                onChange={formik.handleChange}
                                                value={formik.values.planId}
                                                onBlur={formik.handleBlur}>
                                                <option value="">Select Plan</option>
                                                <option value="1">Monthly</option>
                                            </select>
                                            {formik.touched.planId && formik.errors.planId ?
                                                <div className="mt-2 text-sm text-red-600 dark:text-red-500"><span className="font-medium">
                                                    {formik.errors.planId}
                                                </span></div>
                                                : null}
                                        </div>
                                        <div className="col-span-12">
                                            <label htmlFor="address"
                                                className={`block mb-2 text-sm font-medium
                                                ${formik.touched.address && formik.errors.address
                                                        ? 'text-red-900'
                                                        : 'text-gray-900 dark:text-white'}
                                                    `}
                                            >Address</label>
                                            <textarea name="address" id="address"
                                                className={`border text-sm rounded-lg block w-full p-2.5
                                                ${formik.touched.address && formik.errors.address
                                                        ? 'bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white'
                                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'}
                                                    `}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.address}>
                                            </textarea>
                                            {formik.touched.address && formik.errors.address ?
                                                <div className="mt-2 text-sm text-red-600 dark:text-red-500"><span className="font-medium">
                                                    {formik.errors.address}
                                                </span></div>
                                                : null}
                                        </div>

                                        <div className="col-span-6">
                                            <label htmlFor="startDate"
                                                className={`block mb-2 text-sm font-medium
                                                ${formik.touched.startDate && formik.errors.startDate
                                                        ? 'text-red-900'
                                                        : 'text-gray-900 dark:text-white'}
                                                    `}
                                            >Membership Starting Date</label>
                                            <input type="date" name="startDate" id="startDate"
                                                className={`border text-sm rounded-lg block w-full p-2.5
                                                ${formik.touched.startDate && formik.errors.startDate
                                                        ? 'bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white'
                                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'}
                                                    `}
                                                onChange={formik.handleChange}
                                                value={formik.values.startDate} />
                                            {formik.touched.startDate && formik.errors.startDate ?
                                                <div className="mt-2 text-sm text-red-600 dark:text-red-500"><span className="font-medium">
                                                    {formik.errors.startDate}
                                                </span></div>
                                                : null}
                                        </div>
                                        <div className="col-span-6">
                                            <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Membership Ending Date</label>
                                            <input type="date" name="endDate" id="endDate"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                value={formik.values.endDate}
                                                readOnly />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>

                        <div class="grid grid-cols-12 gap-4">
                            <ModalFooter className="col-span-12">
                                <Button type="submit"><FontAwesomeIcon icon={faUser} />  Save Member</Button>
                                <Button color="gray" onClick={() => setOpenMemberModal(false)}>
                                    Decline
                                </Button>
                            </ModalFooter>
                        </div>
                    </form>
                </Modal>
            </div >
        </>
    )
}

export default AddMember