import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, {useState, useEffect} from "react";
import {deleteCobros, saveCobros, updateCobros} from '../../firebase/api'
import {getCobro} from '../../firebase/api'

function EditOrDeleteDeuda({deudaId, openEoD, setOpenEoD, setOpen}) {

  //StyleComponent
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    color: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  //Funcion para obtener la fecha de hoy
  let fechaVar = new Date();
  let diaf = fechaVar.getDate();
  let mes = fechaVar.getMonth();
  mes = mes + 1;
  let ano = fechaVar.getFullYear();

  //Funcion para cerrar el modal
  function handleClose() {
    setOpen(false);
    setOpenEoD(false);
  }

  //Maneja los cambios en los textfields
  const handleInputChange = (e) =>{
    const {name, value} = e.target;
    setEditOrDeleteCobro({...editOrDeleteCobro, [name]:value})
  }

  //Obteniendo datos de una sola deuda
  const getDeuda = async () => {

    if(deudaId === 0){
      return
    }
    const docSnap = await getCobro(deudaId);

    if (docSnap.exists()) {
      setEditOrDeleteCobro(docSnap.data())
    } else {
      //mensaje de error al no encontrar
      console.log("No such document!");
    }
  }

  //Duncion para obtener mas informacion de una sola deunda
  useEffect(()=>{
    getDeuda();
  },[deudaId])

  //Datos iniciales
  const initialState = {
    nombre:' ',
    apellido:' ',
    correo:' ',
    fecha:' ',
    monto:' '
  }

  const [editOrDeleteCobro, setEditOrDeleteCobro] = useState(initialState);

  //Funcion para eliminar
  async function EliminarCobro(){
    const docSnap = await getCobro(deudaId);

    if (docSnap.exists()) {
      deleteCobros(deudaId)
    } else {
      console.log("No such document!");
    }
  }


  //Funcion para editar
  async function handleEdit(e) {
    e.preventDefault();

    const arreglo = {...editOrDeleteCobro, 'fecha':`${diaf}/${mes}/${ano}`}

    setEditOrDeleteCobro(arreglo)
    const docSnap = await getCobro(deudaId);

    if (docSnap.exists()) {
      updateCobros(deudaId, arreglo)
    } else {
      console.log("No such document!");
    }

  }

  return (
    <Grid
      container
      spacing={2}
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Modal
          open={openEoD}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <form onSubmit={handleEdit}>
          <Box sx={style}>
            <Typography align="center" variant="h3" component="h3">
              Ver más
            </Typography>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              mt={2}
            >
              <Grid item md={8} xs={12}>
                <TextField
                  name="nombre"
                  onChange={handleInputChange}
                  required
                  fullWidth
                  id="outlined-required"
                  label="Nombre"
                  placeholder="Nombre del cliente"
                  value={editOrDeleteCobro.nombre}
                />
              </Grid>
              <Grid item md={8} xs={12}>
                <TextField
                  name="apellido"
                  onChange={handleInputChange}
                  required
                  fullWidth
                  id="outlined-required"
                  label="Apellido"
                  placeholder="Apellido del cliente"
                  value={editOrDeleteCobro.apellido}
                />
              </Grid>
              <Grid item md={8} xs={12}>
                <TextField
                  name="correo"
                  onChange={handleInputChange}
                  required
                  fullWidth
                  id="outlined-required"
                  label="Correo"
                  placeholder="Correo del cliente"
                  value={editOrDeleteCobro.correo}
                />
              </Grid>
              <Grid item md={8} xs={12}>
                <TextField
                  name="monto"
                  onChange={handleInputChange}
                  required
                  fullWidth
                  id="outlined-required"
                  label="Cobro"
                  type="number"
                  placeholder="0.00"
                  value={editOrDeleteCobro.monto}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item md={12} xs={12}></Grid>
              <Grid item align="left" md={4} xs={6}>
                <Button onClick={EliminarCobro} variant="outlined">Eliminar</Button>
              </Grid>
              <Grid item align="right" md={4} xs={6}>
                <Button type="submit" variant="contained">Guardar</Button>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Modal>
    </Grid>
  );
}

export { EditOrDeleteDeuda };