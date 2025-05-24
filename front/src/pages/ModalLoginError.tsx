interface MLEProps {
    showModal: boolean,
    closeModal: () => void
}

const ModalLoginError = (props: MLEProps) => {
    return <div style={{backgroundColor: "rgba(0,0,0,0.5)"}} className={props.showModal ? "modal fade show d-block" : "modal fade"} tabIndex={-1}>
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-5 shadow overflow-hidden">
            <div className="modal-body p-5 text-secondary-emphasis">
                <h3 className="text-center mb-4">Login Incorrecto</h3>
                <p className="text-center mb-4">El correo o la contraseña son incorrectos</p>
                <div className="d-flex justify-content-center">
                    <button style={{width: "45%"}} type="button" className="btn btn-primary px-4 fw-semibold" onClick={props.closeModal}>Aceptar</button>
                </div>
            </div>
        </div>
    </div>
</div>
}

export default ModalLoginError;