import  {useState, useEffect } from "react"
import { Table } from "react-bootstrap"
import { FaEdit, FaTrash, FaFilter, FaPlus } from "react-icons/fa"
import { addAccessLog } from "./Login"
import { User } from "./AddUserModal"

import EditUserModal from "./EditUserModal"
import DeleteUserModal from "./DeleteUserModal"
import FilterUserModal from "./FilterUserModal"
import AddUserModal, { Role } from "./AddUserModal"

const URL_BACKEND = import.meta.env.VITE_API_URL

export interface ListUserItem {
    id: number
    name: string
    email: string
    password_hash: string
    role_id : number
    Role : Role 
}

const ListUsers = () => {

    const [allUsers, setAllUsers] = useState<ListUserItem[]>([])
    const [filterRole, setFilterRole] = useState<number>(0)
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null) 
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [roles, setRoles] = useState<Role[]>([])
    const [modalType, setModalType] = useState<'edit' | 'delete' | 'filter' | 'add'>('edit')
    const [userToEdit, setUserToEdit] = useState<ListUserItem | null>(null)
    const [currentUserId, setCurrentUserId] = useState<number>(0);

    const httpGetId = async () => {
        const user = sessionStorage.getItem('user');
        let token = '';
        if (user) {
            const userInfo = JSON.parse(user);
            token = userInfo.token;
        }

        const url = URL_BACKEND + "/admin/users/me"
        const resp = await fetch(url,  {
            headers: {
              'Authorization': `Bearer ${token}`
            }
        })
        
        let id = 0
        const data = await resp.json()
        if  (data.msg == ""){
            id = data.id
            console.log(id)
            setCurrentUserId(id)
        }else {
            console.error(`Error al obtener usuario: ${data.msg}`)
        }
    }

    useEffect(() => {
        httpGetId()
    }, [])

    const httpAddUser = async (user : User) => {
        const url = URL_BACKEND + "/admin/users"
        console.log(user.name)
        const resp = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
               name : user.name,
               email : user.email,
               password_hash : user.password_hash,
               role_id : user.role_id
            }),
            headers: {
                "Content-Type": "application/json"
            },
        })
        const data = await resp.json()
        if (data.msg == ""){
            if (filterRole === 0) {
                await httpGetUsers()
            } else {
                await httpFilterUsers(filterRole)
            }
        } else {
            console.error(`Error al agregar usuario: ${data.msg}`)
        }
    }

    const httpGetUsers = async () => {
        const url = URL_BACKEND + "/admin/users"
        const resp = await fetch(url)
        const data = await resp.json()
        if  (data.msg == ""){
            const listaUsuarios = data.usuarios
            setAllUsers(listaUsuarios)
        }else {
            console.error(`Error al obtener usuarios: ${data.msg}`)
        }
    }

    const httpGetRoles = async () => {
        const url = URL_BACKEND + "/admin/roles"
        const resp = await fetch(url)
        const data = await resp.json()
        if  (data.msg == ""){
            const listaRoles = data.roles
            setRoles(listaRoles)
        }else {
            console.error(`Error al obtener roles: ${data.msg}`)
        }
    }

    const httpDeleteUser = async (id: number) => {
        const url = URL_BACKEND + "/admin/users/?id=" + id
        const resp = await fetch(url, {
            method: "DELETE",
        })
        const data = await resp.json()
        if (data.msg == ""){
            httpGetUsers() 
        }else {
            console.error(`Error al eliminar usuario: ${data.msg}`)
        }
    }

    const httpGetUser = async (id: number) => {
        const url = `${URL_BACKEND}/admin/users/${id}`
        const resp = await fetch(url)
        const data = await resp.json()
        if (data.msg === "") {
            return data.usuario;
        } else {
            console.error(`Error al obtener el usuario: ${data.msg}`);
        }
    }

    const httpUpdateUser = async (id: number, user: User) => {
        const url = `${URL_BACKEND}/admin/users/${id}`
        console.log(user.name)
        const resp = await fetch(url, {
            method: "PUT",
            body: JSON.stringify({
                name: user.name, // cambio
                email: user.email,
                password_hash: user.password_hash,
                role_id: user.role_id,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await resp.json()
        if (data.msg === "") {
            if (filterRole === 0) {
                await httpGetUsers()
            } else {
                await httpFilterUsers(filterRole)
            }
        } else {
            console.error(`Error al actualizar el usuario: ${data.msg}`);
        }
    }

    const httpFilterUsers = async (id: number) => {
        const url = `${URL_BACKEND}/admin/users/filter?role_id=${id}`
        const resp = await fetch(url)
        const data = await resp.json()
        if  (data.msg === ""){
            const filteredUsers = data.usuarios
            setAllUsers(filteredUsers)
        } else {
            console.error(`Error al obtener usuarios filtrados: ${data.msg}`)
        }
    }

    useEffect(() => {
            httpGetId();
    }, []);

    useEffect(() => {
        if (filterRole === 0) {
            httpGetUsers() // Obtiene todos los usuarios si filterRole es 0
        } else {
            httpFilterUsers(filterRole) // Filtra usuarios por role_id
        }
    }, [filterRole])
    
    useEffect(() => {
        httpGetRoles()  
    }, []) 
    
    const openModal = async ( type: 'edit' | 'delete' | 'filter' | 'add', userId?: number) => {
        setModalType(type)
        setIsModalOpen(true)

        if (userId) {
            setSelectedUserId(userId) 
            
            if (type === 'edit') {
                const user = await httpGetUser(userId)
                if (user) {
                    setUserToEdit(user)
                }
            }
        }
    }

    const closeModal = () => {
        setSelectedUserId(null)
        setUserToEdit(null)
        setIsModalOpen(false)
    }

    return (
        <div className="table-section" style={{ minHeight: "80vh" }}>
            <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
                <h2 className="table-title m-0">Mis usuarios</h2>
                <div className="d-flex flex-row">
                    <button onClick={() => openModal('filter')} className="btn btn-primary btn-lg me-4 d-flex align-items-center">
                        <FaFilter className="me-2" />
                        Filtrar
                    </button>
                    <button onClick={() => openModal('add')} className="btn btn-primary btn-lg me-4 d-flex align-items-center">
                        <FaPlus className="me-2" />
                        Agregar
                    </button>
                </div>
            </div>
            <div className="usertable-title">
                <Table className="custom-table" hover>
                    <thead>
                        <tr>
                            <th className="text-start">Id</th>
                            <th className="text-start">Nombre</th>
                            <th className="text-start">Correo</th>
                            {/* <th className="text-start">Password</th> */}
                            <th className="text-start">Rol</th>
                            <th className="text-center">Accion</th>
                        </tr>
                    </thead>
                    <tbody> 
                        {allUsers.map((user : ListUserItem) => (
                            <tr key={user.id}>
                                <td className="text-start">{String(user.id).padStart(3, '0')}</td>
                                <td className="text-start">{user.name}</td>
                                <td className="text-start">{user.email}</td>
                                {/*<td className="text-start">{user.password_hash}</td>*/}
                                <td>
                                    {
                                        user.Role != null
                                            ? user.Role.name
                                            : "-"
                                        
                                    }
                                </td> 
                                <td className="text-center">
                                    <button onClick={() => openModal('edit', user.id)} className="btn">
                                        <FaEdit size={25}/>
                                    </button>
                                    <button onClick={() => openModal('delete', user.id)} className="btn">
                                        <FaTrash size={25}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {  allUsers.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center">No hay usuarios</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            {isModalOpen && selectedUserId != null && modalType === 'edit' && userToEdit && (
                <EditUserModal
                    roles={ roles }
                    user={ userToEdit}
                    closeModal={closeModal}
                    onSave={ async (userToEdit : User) => {
                        await httpUpdateUser(selectedUserId, userToEdit)
                        closeModal() 
                        addAccessLog("Editar Usuario")
                    }}
                    isCurrentUser = { selectedUserId === currentUserId}
                />
            )}
            {isModalOpen && selectedUserId != null && modalType === 'delete' && (
                <DeleteUserModal
                    closeModal={closeModal}
                    onDelete={ async () => {
                        await httpDeleteUser(selectedUserId)
                        closeModal()
                        addAccessLog("Eliminar Usuario")
                    }}
                    isCurrentUser = { selectedUserId === currentUserId}
                />
            )}
            {isModalOpen && modalType === 'filter' && (
                <FilterUserModal
                    roles={ roles }
                    closeModal={closeModal}
                    filterRole={filterRole}
                    setFilterRole={setFilterRole}
                    onApplyFilter={ async (role_id : number) => {
                        setFilterRole(role_id) 
                        closeModal()
                    }}
                />
            )}
            {isModalOpen && modalType === 'add' && (
                <AddUserModal
                    roles={ roles }
                    closeModal={ closeModal }
                    onSave={ async (user : User) => {
                        await httpAddUser(user)
                        closeModal() 
                        addAccessLog("Agregar Usuario")
                    }}
                />
            )}
        </div>
  )
}

export default ListUsers