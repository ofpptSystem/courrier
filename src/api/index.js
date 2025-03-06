import axios from "axios";
export const BASE_URL = { link: "" };

export const LoginApi = async (email, password) => {
  if (!email || !password) return ["email or password is empty", null];

  try {
    const response = await axios.post(`${BASE_URL.link}/login`, {
      email,
      password,
    });
    return [null, response.data];
  } catch (error) {
    return [error, null];
  }
};
export const tokenAuthApi = async (Token = "") => {
  if (!Token) return ["token is empty", null];
  try {
    const response = await axios.post(
      `${BASE_URL.link}/login/token`,
      {},
      { headers: { Authorization: Token } }
    );
    return [null, response.data];
  } catch (error) {
    return [error, null];
  }
};
export const GetEvents = async (Token = "", dates) => {
  if (!Token) return ["token is empty", null];
  const result = [null, null];
  await axios
    .get(
      `${BASE_URL.link}/courier/bettwen?startDate=${
        !dates.start
          ? new Date().toISOString().split("T")[0]
          : dates.start + (!dates.end ? "" : "&endDate=" + dates.end)
      }`,
      {
        headers: {
          Authorization: Token,
        },
      }
    )
    .then((res) => {
      result[1] = res;
    })
    .catch((err) => {
      result[0] = err;
    });
  return result;
};
export const getDepartements = async (token) => {
  if (!token) return ["token is empty", null];
  const result = [null, null];
  await axios
    .get(`${BASE_URL.link}/departement/all`, {
      headers: { Authorization: token },
    })
    .then((res) => {
      result[1] = res.data;
    })
    .catch((err) => {
      result[0] = err;
    });
  return result;
};
export const getGroups = async (token) => {
  if (!token) return ["token is empty", null];
  const result = [null, null];
  await axios
    .get(`${BASE_URL.link}/groups/all`, { headers: { Authorization: token } })
    .then((res) => {
      result[1] = res.data;
    })
    .catch((err) => {
      result[0] = err;
    });
  return result;
};
export const AddCourier = async (formData, departements, groups) => {
  if (!formData) {
    return [
      "All parameters (token, title, description, deadline, critical, departements) are required",
      null,
    ];
  }
  const result = [null, null];
  try {
    formData.append(
      "assigneed_to",
      JSON.stringify({
        departements,
        groups,
      })
    );
    const response = await axios.post(
      `${BASE_URL.link}/courier/add`,
      formData,
      {
        headers: {
          Authorization: formData.get("token"),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    result[1] = response;
  } catch (err) {
    result[0] = err;
  }
  return result;
};

export const UpdateCourier = async (formData, departements, groups) => {
  if (!formData.get("token")) {
    return ["token error", null];
  }

  const result = [null, null];
  try {
    formData.append(
      "assigneed_to",
      JSON.stringify({
        departements,
        groups,
      })
    );
    const response = await axios.post(
      `${BASE_URL.link}/courier/update/${formData.get("id")}`,
      formData,
      {
        headers: {
          Authorization: formData.get("token"),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    result[1] = response;
  } catch (err) {
    result[0] = err;
  }

  return result;
};
export const AddDepartment = async (formData) => {
  if (!formData) {
    return [
      "All parameters (token, name, parent_departement_id) are required",
      null,
    ];
  }
  const result = [null, null];
  try {
    const response = await axios.post(
      `${BASE_URL.link}/departement/add`,
      formData,
      {
        headers: {
          Authorization: formData.token,
        },
      }
    );
    result[1] = response;
  } catch (err) {
    result[0] = err;
  }
  return result;
};
export const DeleteDepartment = async (token, department_id) => {
  if (!token || !department_id) {
    return ["All parameters (token, department_id) are required", null];
  }

  const result = [null, null];
  try {
    const response = await axios.delete(
      `${BASE_URL.link}/departement/${department_id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    result[1] = response;
  } catch (err) {
    result[0] = err;
  }
  return result;
};
export const UpdateDepartementApi = async (
  token,
  department_id,
  updatedName
) => {
  if (!token || !department_id || !updatedName) {
    return [
      "All parameters (token, department_id, updatedName) are required",
      null,
    ];
  }

  const result = [null, null];
  try {
    const response = await axios.post(
      `${BASE_URL.link}/departement/update/${department_id}`,
      { updateBy: { name: updatedName } }, // Body de la requête
      {
        headers: {
          Authorization: token,
        },
      }
    );
    result[1] = response.data;
  } catch (err) {
    result[0] = err.response ? err.response.data : err.message;
  }

  return result;
};
export const AddGroupApi = async (formData) => {
  if (
    !formData ||
    !formData.token ||
    !formData.name ||
    !formData.department_id
  ) {
    return ["All parameters (token, name, departement_id) are required", null];
  }

  const result = [null, null];
  try {
    const response = await axios.post(
      `${BASE_URL.link}/groups/add`,
      { name: formData.name, departement_id: Number(formData.department_id) },
      {
        headers: {
          Authorization: formData.token,
        },
      }
    );
    result[1] = response.data;
  } catch (err) {
    result[0] = err.response?.data || err.message;
  }
  return result;
};
export const deleteGroupApi = async (id, token) => {
  if (!id) {
    return ["Group ID is required", null];
  }
  const result = [null, null];
  try {
    const response = await axios.delete(`${BASE_URL.link}/groups/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    result[1] = response.data; // Stocker le succès
  } catch (err) {
    result[0] = err.response?.data || err.message; // Stocker l'erreur
  }
  return result;
};
export const UpdateGrouptApi = async (token, id, updatedName) => {
  if (!token || !id || !updatedName) {
    return [
      "All parameters (token, department_id, updatedName) are required",
      null,
    ];
  }
  const result = [null, null];
  try {
    const response = await axios.post(
      `${BASE_URL.link}/groups/update/${id}`,
      { updateBy: { name: updatedName } }, // Body de la requête
      {
        headers: {
          Authorization: token,
        },
      }
    );
    result[1] = response.data;
  } catch (err) {
    result[0] = err.response ? err.response.data : err.message;
  }

  return result;
};
export const AddUserApi = async (formData) => {
  if (
    !formData ||
    !formData.token ||
    !formData.nom ||
    !formData.prenom ||
    !formData.email ||
    !formData.password ||
    !formData.role
  ) {
    return [
      "All parameters (token, nom, prenom, email, password) are required",
      null,
    ];
  }

  const result = [null, null];
  try {
    const response = await axios.post(
      `${BASE_URL.link}/users/add`,
      {
        first_name: formData.nom,
        last_name: formData.prenom,
        email: formData.email,
        password: formData.password,
        departement_id: +formData.departement_id,
        group_id: +formData.group_id,
        role: formData.role,
      },
      {
        headers: {
          Authorization: formData.token,
        },
      }
    );
    result[1] = response.data;
  } catch (err) {
    result[0] = err.response?.data || err.message;
  }
  return result;
};
export const GetUsersApi = async (token) => {
  if (!token) return ["no token", null];
  try {
    const response = await axios.get(
      `${BASE_URL.link}/users/`,

      {
        headers: {
          Authorization: token,
        },
      }
    );

    return [null, response.data];
  } catch (err) {
    return [err.response?.data || err.message, null];
  }
};
export const GetUsersById = async (token, id) => {
  if (!token) return ["no token", null];
  try {
    const response = await axios.get(`${BASE_URL.link}/users/${id}`, {
      headers: {
        Authorization: token,
      },
    });

    return [null, response.data];
  } catch (err) {
    return [err.response?.data || err.message, null];
  }
};
export const DeleteUserApi = async (id, token) => {
  if (!id) {
    return ["User ID is required", null];
  }
  const result = [null, null];
  try {
    const response = await axios.delete(`${BASE_URL.link}/users/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    result[1] = response.data; // Stocker le succès
  } catch (err) {
    result[0] = err.response?.data || err.message; // Stocker l'erreur
  }
  return result;
};
export const getArchive = async (token, pageNumber) => {
  if (!token || !pageNumber || pageNumber < 0) {
    return ["fealds required", null];
  }
  try {
    const response = await axios.get(`${BASE_URL.link}/courier/all`, {
      params: {
        page: pageNumber,
      },
      headers: {
        Authorization: token,
      },
    });

    return [null, response.data]; // Return success result
  } catch (error) {
    console.error("Error fetching archive:", error);
    return [error, null]; // Return error
  }
};
export const UpdateUserApi = async (id, token, data) => {
  if (!id) {
    return ["User ID is required", null];
  }

  const result = [null, null];
  try {
    const response = await axios.put(
      `${BASE_URL.link}/users/${id}`,
      {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        departement_id: +data.departement_id,
        group_id: +data.group_id,
        role: data.role,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    result[1] = response.data; // Stocker le succès
  } catch (err) {
    result[0] = err.response?.data || err.message; // Stocker l'erreur
  }
  return result;
};
export const resetPasswordAPI = async (password, token) => {
  if (!password || !token) {
    return ["data required", null];
  }
  try {
    const response = await axios.post(
      BASE_URL.link + "/users/verify-forget-pass",
      { pass: password },
      { headers: { Authorization: token } }
    );
    return [null, response.data];
  } catch (error) {
    return [error, null];
  }
};
export const GetForgetPassLinkAPI = async (email) => {
  if (!email) return ["data required", null];
  try {
    const response = await axios.get(
      BASE_URL.link + "/users/request-forget-pass",
      { params: { email } }
    );
    return [null, response.data];
  } catch (error) {
    return [error, null];
  }
};
export const getCourierById = async (id, token) => {
  try {
    if (!id || !token) return ["id or token is empty", null];
    const d = await axios.get(BASE_URL.link + "/courier/" + id, {
      headers: { Authorization: token },
    });
    return [null, d.data];
  } catch (e) {
    return [e, null];
  }
};
export const validateCourierAPI = async (
  id,
  token,
  state,
  validation_result
) => {
  try {
    if (!id || !token) return ["id or token is empty", null];
    const d = await axios.post(
      BASE_URL.link + "/courier/validate/" + id,
      { is_validated: state, result_validation: validation_result },
      {
        headers: { Authorization: token },
      }
    );
    return [null, d.data];
  } catch (e) {
    return [e, null];
  }
};
export const getStatusAPI = async (token, year) => {
  try {
    if (!token) return ["token is empty", null];
    const d = await axios.get(BASE_URL.link + "/courier/status", {
      headers: { Authorization: token },
      params: {
        year,
      },
    });
    return [null, d.data];
  } catch (e) {
    return [e, null];
  }
};
