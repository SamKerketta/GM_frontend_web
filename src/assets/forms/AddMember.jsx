import { faUser } from "@fortawesome/free-solid-svg-icons/faUser"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import 'flowbite';
import { Button, HelperText, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import { ADMITION_FEE, API_BASE_URL, CURRENT_DATE } from "../../config/utilities";
import ErrorToast from "../../components/ErrorToast";
import axios from "axios";
import SuccessToast from "../../components/SuccessToast";

/**
 * Things to do
 * 2. Add Discount Columns (In enhancement)
 */

const AddMember = ({ openMemberModal, setOpenMemberModal, setreloadMembers }) => {
    const planListApi = `${API_BASE_URL}/crud/plans/list`
    const addMemberApi = `${API_BASE_URL}/crud/member/add-member`

    const currentDate = CURRENT_DATE;
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        axios.post(`${planListApi}`)
            .then((response) => {
                if (response.status === 200) {
                    const apiData = response.data;
                    if (apiData.status === true) {
                        setPlans(apiData.data)
                    }
                } else {
                    ErrorToast.show(response.data.message)
                }
            })
    }, [])


    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            dob: '',
            gender: '',
            planId: '',
            address: '',
            membershipStart: currentDate,
            endDate: '',
            isPayment: 0,
            admissionFee: 0,
            membershipFee: 0,
            payableAmt: 0,
            tac: true,
            durationInMonths: 0,
            isAdmitFee: 0,

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
            membershipStart: Yup.date()
                .required('Please Enter This Field'),
            tac: Yup.boolean()
                .oneOf([true], 'You must agree with our terms and conditions'),
        }),
        onSubmit: (values, { resetForm }) => {
            console.log(values);
            submitMember(values, resetForm)
        }
    });

    // Submit Members api call
    const submitMember = (payload, resetForm) => {
        axios.post(`${addMemberApi}`, payload)
            .then((response) => {
                if (response.status === 200) {
                    const apiData = response.data;
                    if (apiData.status === true) {
                        SuccessToast.show(apiData.message)
                        setOpenMemberModal(false)
                        setreloadMembers(true)
                        resetForm();
                    }
                    if (apiData.status === false) {
                        ErrorToast.show(apiData.message)
                    }
                } else {
                    ErrorToast.show(response.data.message)
                }
            })
    }

    useEffect(() => {
        if (formik.values.membershipStart) {
            const addMonths = formik.values.durationInMonths;                            // Do here dynamication as per plan
            const start = new Date(formik.values.membershipStart);
            const laterDate = new Date(start.setMonth(start.getMonth() + Number(addMonths)));
            const formattedlaterDate = laterDate.toISOString().split('T')[0];
            formik.setFieldValue('endDate', formattedlaterDate);
        }
    }, [formik.values.membershipStart, formik.values.planId])

    // Payment Calculation
    useEffect((() => {
        if (formik.values.isPayment) {
            const admissionFee = (formik.values.isAdmitFee == 1) ? ADMITION_FEE : 0;
            const membershipFeePerMonth = Number(formik.values.membershipFee);          // Vary as per Plan
            const totalPayableAmt = admissionFee + membershipFeePerMonth;

            formik.setFieldValue('admissionFee', admissionFee);
            formik.setFieldValue('membershipFee', membershipFeePerMonth);
            formik.setFieldValue('payableAmt', totalPayableAmt);
        }
    }), [formik.values.isPayment, formik.values.planId])

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
                                                // onChange={formik.handleChange}
                                                onChange={(e) => {
                                                    const selectedOption = e.target.selectedOptions[0];
                                                    const duration = selectedOption.getAttribute('data-duration');
                                                    const price = selectedOption.getAttribute('data-price');
                                                    const isAdmitFee = selectedOption.getAttribute('data-isadmitfee');

                                                    formik.setFieldValue('planId', e.target.value);
                                                    formik.setFieldValue('durationInMonths', duration);
                                                    formik.setFieldValue('membershipFee', price);
                                                    formik.setFieldValue('isAdmitFee', isAdmitFee);
                                                }}
                                                value={formik.values.planId}
                                                onBlur={formik.handleBlur}>
                                                <option value="">Select Plan</option>
                                                {plans.map((plan) => (
                                                    <option
                                                        data-duration={plan.duration}
                                                        data-price={plan.price}
                                                        data-isadmitfee={plan.is_admission_fee_required}
                                                        value={plan.id}>{plan.plan_name}
                                                        <span class="text-sm text-gray-500">
                                                            ({plan.duration} In Months)</span>
                                                    </option>
                                                ))}
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
                                            <label htmlFor="membershipStart"
                                                className={`block mb-2 text-sm font-medium
                                                ${formik.touched.membershipStart && formik.errors.membershipStart
                                                        ? 'text-red-900'
                                                        : 'text-gray-900 dark:text-white'}
                                                    `}
                                            >Membership Starting Date</label>
                                            <input type="date" name="membershipStart" id="membershipStart"
                                                className={`border text-sm rounded-lg block w-full p-2.5
                                                ${formik.touched.membershipStart && formik.errors.membershipStart
                                                        ? 'bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white'
                                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'}
                                                    `}
                                                onChange={formik.handleChange}
                                                value={formik.values.membershipStart} />
                                            {formik.touched.membershipStart && formik.errors.membershipStart ?
                                                <div className="mt-2 text-sm text-red-600 dark:text-red-500"><span className="font-medium">
                                                    {formik.errors.membershipStart}
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
                                        <div className="col-span-12">
                                            <input id="isPayment" type="checkbox" defaultValue
                                                className="mt-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                onChange={formik.handleChange}
                                                checked={formik.values.isPayment}
                                            />
                                            <label htmlFor="isPayment" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Do You Want to Pay ?</label>
                                        </div>

                                        {/* Payment Parameters */}
                                        {formik.values.isPayment ? (
                                            <div className="col-span-4">
                                                <label htmlFor="admissionFee" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Admission Fee
                                                </label>
                                                <input
                                                    type="text"
                                                    name="admissionFee"
                                                    id="admissionFee"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                    value={formik.values.admissionFee}
                                                    readOnly
                                                />
                                            </div>
                                        ) : null}

                                        {formik.values.isPayment ? (
                                            <div className="col-span-4">
                                                <label htmlFor="membershipFee" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Membership Fee
                                                </label>
                                                <input
                                                    type="text"
                                                    name="membershipFee"
                                                    id="membershipFee"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                    value={formik.values.membershipFee}
                                                    readOnly
                                                />
                                            </div>
                                        ) : null}

                                        {formik.values.isPayment ? (
                                            <div className="col-span-4">
                                                <label htmlFor="payableAmt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Payable Amount
                                                </label>
                                                <input
                                                    type="text"
                                                    name="payableAmt"
                                                    id="payableAmt"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                    value={formik.values.payableAmt}
                                                    readOnly
                                                />
                                            </div>
                                        ) : null}
                                        {/* Payment Parameters */}

                                        <div className="col-span-12">
                                            <input id="tac" type="checkbox" defaultValue
                                                className="mt-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                onChange={formik.handleChange}
                                                checked={formik.values.tac}
                                            />
                                            <label htmlFor="tac" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                Agree <a className="text-blue-800" href="terms-and-conditions">Terms and Conditions</a>
                                            </label>
                                            {formik.touched.tac && formik.errors.tac ?
                                                <div className="mt-2 text-sm text-red-600 dark:text-red-500"><span className="font-medium">
                                                    {formik.errors.tac}
                                                </span></div>
                                                : null}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </ModalBody>

                        <div class="grid grid-cols-12 gap-4 bg-white">
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