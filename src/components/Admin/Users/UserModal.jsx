import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, User, Mail, Phone } from "lucide-react";
import * as Yup from "yup";

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Nama terlalu pendek!")
    .max(50, "Nama terlalu panjang!")
    .required("Nama wajib diisi"),
  email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
  phone: Yup.string()
    .matches(/^(\+62|62|0)8[1-9][0-9]{6,11}$/, "Nomor telepon tidak valid")
    .required("Nomor telepon wajib diisi"),
});

const UserModal = ({ isOpen, setIsOpen, isUpdate, selectedUser }) => {
  const initialValues = isUpdate
    ? { ...selectedUser }
    : { name: "", email: "", phone: "" };

  const handleSubmit = (values, { resetForm }) => {
    if (isUpdate) {
      // Update user logic
    } else {
      // Add user logic
    }
    setIsOpen(false);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isUpdate ? "Perbarui User" : "Tambah User Baru"}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={UserSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="p-6 space-y-5">
              {[
                {
                  name: "name",
                  label: "Nama",
                  type: "text",
                  placeholder: "Masukkan nama user",
                  icon: <User size={20} className="text-gray-400" />,
                },
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "Masukkan email user",
                  icon: <Mail size={20} className="text-gray-400" />,
                },
                {
                  name: "phone",
                  label: "Nomor Telepon",
                  type: "tel",
                  placeholder: "Masukkan nomor telepon",
                  icon: <Phone size={20} className="text-gray-400" />,
                },
              ].map(({ name, label, type, placeholder, icon }) => (
                <div key={name} className="relative">
                  <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {icon}
                    </div>
                    <Field
                      type={type}
                      name={name}
                      id={name}
                      placeholder={placeholder}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none 
                          ${
                            touched[name] && errors[name]
                              ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                          }`}
                    />
                  </div>
                  <ErrorMessage
                    name={name}
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              ))}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  {isUpdate ? "Perbarui User" : "Tambah User"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UserModal;
