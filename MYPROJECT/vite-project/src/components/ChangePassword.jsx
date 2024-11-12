import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import './ChangePassword.css';

const ChangePassword = () => {
  const [successMessage, setSuccessMessage] = useState("");  
  const token = localStorage.getItem('token');

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .min(8, "New password must be at least 8 characters")
        .matches(/[A-Z]/, "New password must contain at least one uppercase letter")
        .matches(/[a-z]/, "New password must contain at least one lowercase letter")
        .matches(/\d/, "New password must contain at least one number")
        .matches(/[@$!%*?&]/, "New password must contain at least one special character")
        .required("New password is required"),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Please confirm your new password")
    }),
    onSubmit: async (values, { setSubmitting, resetForm, setStatus }) => {
      try {
        const response = await axios.put(
          "http://localhost:5029/api/auth/change-password",
          { ...values },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setSuccessMessage("Password updated successfully!");  
        setStatus(""); 
        resetForm(); 
      } catch (error) {
        setStatus(error.response.data.message || "Error updating password");
        setSuccessMessage(""); 
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <>
      <div className="password-box">
        <h2 className="creative-heading">Change Your Password</h2>
        <form onSubmit={formik.handleSubmit}>
          
          <div className="user-box">
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.currentPassword}
              className={formik.touched.currentPassword && formik.errors.currentPassword ? "input-error" : ""}
            />
            <label htmlFor="currentPassword">Current Password</label>
            {formik.touched.currentPassword && formik.errors.currentPassword ? (
              <div className="error-message">{formik.errors.currentPassword}</div>
            ) : null}
          </div>

          <div className="user-box">
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
              className={formik.touched.newPassword && formik.errors.newPassword ? "input-error" : ""}
            />
            <label htmlFor="newPassword">New Password</label>
            {formik.touched.newPassword && formik.errors.newPassword ? (
              <div className="error-message">{formik.errors.newPassword}</div>
            ) : null}
          </div>

          <div className="user-box">
            <input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmNewPassword}
              className={formik.touched.confirmNewPassword && formik.errors.confirmNewPassword ? "input-error" : ""}
            />
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword ? (
              <div className="error-message">{formik.errors.confirmNewPassword}</div>
            ) : null}
          </div>

          <center>
            <button type="submit" disabled={formik.isSubmitting}>
              Change Password
              <span></span>
            </button>
          </center>

          {successMessage && <p className="success-message">{successMessage}</p>}
          {formik.status && <p className="error-message">{formik.status}</p>}
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
