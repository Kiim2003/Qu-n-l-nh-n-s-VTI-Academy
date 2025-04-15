"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect, useState } from "react";
import { getItem, setField, setItem } from "@/services/helpers.service";
import { AUTH_SERVICE } from "@/services/api.service";
import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";
import Link from "next/link";
import Loader from "@/components/common/Loader";
import { AxiosResponse } from "axios";

// Kiểu dữ liệu user từ backend
type UserResponseData = {
	id: string;
	email: string;
	phone: string;
	gender: string;
	name: string;
	avatar: string;
};

const Settings = () => {
	const user = getItem("user");

	const [form, setForm]: any = useState({
		email: "",
		phone: "",
		gender: "",
		name: "",
		avatar: "",
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState({
		email: "",
		password: "",
		name: "",
		phone: "",
		cf_password: "",
	});
	const [errorForm, setErrorForm] = useState("");

	useEffect(() => {
		if (user) {
			setForm({
				email: user.email,
				phone: user.phone,
				gender: user.gender,
				name: user.name,
				avatar: user.avatar,
			});
		}
		getDetail();
	}, []);

	const getDetail = async () => {
		setLoading(true);
		const response = (await AUTH_SERVICE.show()) as AxiosResponse<{
			status: string;
			data: UserResponseData;
		}>;
		setLoading(false);

		if (response?.data?.status === "success") {
			const data = response.data.data;
			setForm({
				email: data.email,
				phone: data.phone,
				gender: data.gender,
				name: data.name,
				avatar: data.avatar,
			});
		}
	};

	const onSubmit = async (e: any) => {
		e.preventDefault();
		let count = 0;
		let objError: any = {
			name: "",
			email: "",
			password: "",
			cf_password: "",
		};

		if (!form.name || form.name === "") {
			objError.name = "Họ tên không được để trống.";
			count++;
		}

		if (count > 0) {
			setError(objError);
			return;
		}

		setLoading(true);
		const formData = {
			name: form.name,
			phone: form.phone,
		};

		const response = (await AUTH_SERVICE.update(1, formData)) as AxiosResponse<{
			status: string;
			message: string;
			data: UserResponseData;
		}>;
		setLoading(false);

		if (response?.data?.status === "success") {
			const data = response.data.data;
			setItem("user", data);
			setErrorForm("");
		} else {
			setErrorForm(response?.data?.message || "Lỗi khi cập nhật");
		}
	};

	return (
		<DefaultLayout>
			<div className="mx-auto max-w-270">
				<Breadcrumb pageName="Settings" />
				{loading && (
					<Loader className="bg-opacity-60 bg-white z-50 fixed top-0 left-0 w-full h-full" />
				)}
				<div className={loading ? "z-0" : "z-10"}>
					<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
						<div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
							<h3 className="font-medium text-black dark:text-white">
								Personal Information
							</h3>
						</div>
						<div className="p-7">
							<form>
								{errorForm && <p className="text-red mb-2">{errorForm}</p>}
								<div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
									<div className="w-full sm:w-1/2">
										<label className="mb-3 block text-sm font-medium text-black dark:text-white">
											Full Name
										</label>
										<input
											className={`w-full rounded border bg-gray py-3 pl-4 pr-4 text-black ${error.name ? "border-red" : "border-stroke"
												} focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
											type="text"
											value={form.name}
											onChange={(e) => {
												const value = e?.target?.value?.trim() || "";
												setField(value, "name", form, setForm);
											}}
											placeholder="Devid Jhon"
										/>
									</div>

									<div className="w-full sm:w-1/2">
										<label className="mb-3 block text-sm font-medium text-black dark:text-white">
											Phone Number
										</label>
										<input
											className={`w-full rounded border bg-gray py-3 pl-4 pr-4 text-black ${error.phone ? "border-red" : "border-stroke"
												} focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
											type="text"
											value={form.phone}
											onChange={(e) => {
												const value = e?.target?.value?.trim() || "";
												setField(value, "phone", form, setForm);
											}}
											placeholder="+990 3343 7865"
										/>
									</div>
								</div>

								<div className="mb-5.5">
									<label className="mb-3 block text-sm font-medium text-black dark:text-white">
										Email Address
									</label>
									<input
										className={`w-full rounded border bg-gray py-3 pl-4 pr-4 text-black border-stroke focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
										type="email"
										value={form.email}
										readOnly
										placeholder="example@email.com"
									/>
								</div>

								<div className="mb-5.5">
									<label className="mb-3 block text-sm font-medium text-black dark:text-white">
										Gender
									</label>
									<SelectGroupTwo
										title={""}
										options={[
											{ id: "MALE", name: "Male" },
											{ id: "FEMALE", name: "Female" },
											{ id: "OTHER", name: "Other" },
										]}
										key_obj="gender"
										value={form.gender}
										form={form}
										setForm={setForm}
									/>
								</div>

								<div className="flex justify-end gap-4.5">
									<Link
										href="/settings"
										className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
									>
										Cancel
									</Link>
									<button
										className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
										type="submit"
										onClick={onSubmit}
									>
										Save
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</DefaultLayout>
	);
};

export default Settings;
