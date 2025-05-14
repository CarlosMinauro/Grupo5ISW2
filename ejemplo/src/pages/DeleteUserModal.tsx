interface DeleteUserModalProps {
    closeModal: () => void
    onDelete: () => void
    isCurrentUser: boolean // nuevo   
}

const DeleteUserModal = (props: DeleteUserModalProps) => {
    return (
        <div className="modal fade show d-flex align-items-center justify-content-center"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", minHeight: "100vh" }} aria-modal="true" role="dialog">
            <div className="modal-dialog" style={{ maxWidth: "450px", width: "100%" }}>
                <div className="modal-content">
                    <div className="modal-header d-flex justify-content-center w-100 border-0">
                        <h4 className="modal-title">Aviso!</h4>
                    </div>
                    <div className="modal-body text-center">
                        {props.isCurrentUser ? (
                            <p><strong>No puedes eliminarte a ti mismo</strong></p>
                        ) : (
                            <p>¿Estás seguro que deseas eliminar este registro?</p>
                        )}
                    </div>
                    <div className="modal-footer justify-content-center border-0">
                        {props.isCurrentUser ? (
                            <button type="button" className="btn btn-secondary mx-3" onClick={ () => props.closeModal()}>Ok</button>
                        ) : (
                            <>
                                <button type="button" className="btn btn-secondary mx-3" onClick={ () => props.closeModal()}>Cancelar</button>
                                <button type="button" className="btn btn-primary mx-3" onClick={ () => props.onDelete()}>Eliminar</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
  )
}

export default DeleteUserModal