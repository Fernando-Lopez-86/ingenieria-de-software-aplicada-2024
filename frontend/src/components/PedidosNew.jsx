

import React from 'react';
import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { Modal, Button } from 'react-bootstrap';
import { UserContext } from './UserContext'; 
import { NumericFormat } from 'react-number-format';

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.mjs`;


function PedidosNew(){

    const API_URL = process.env.REACT_APP_API_URL;

    const [pdfText, setPdfText] = useState('');

    const [isSubmitted, setIsSubmitted] = useState(false);

    const navigate = useNavigate();
    const { user } = useContext(UserContext); // Obtener el usuario desde el contexto

    // Utiliza useState para manejar el estado de cada campo del formulario (TIPO, CLIENTE, NROPED, NROREAL, ESTADOSEG, CODIGO) y la lista de artículos (items).
    const [CLIENTE, setCLIENTE] = useState('');
    const [DIREENT, setDIREENT] = useState('');
    const [LOCENT, setLOCENT] = useState('');
    const [PROENT, setPROENT] = useState('');
    const [CONDVENTA, setCONDVENTA] = useState('');
    const [TELEFONOS, setTELEFONOS] = useState('');
    const [FECTRANS, setFECTRANS] = useState('');
    const [FECEMISION, setFECEMISION] = useState('');
    const [COMENTARIO, setCOMENTARIO] = useState('_Horario de entrega:\n_Pedir Turno:\n_Enviar Publicidad:');
    const [items, setItems] = useState([{
        ITEM: '001',
        ARTICULO: '',
        CANTPED: '',
        PRECIO: '',
        DESCUENTO: '',
    }]);


    const [error, setError] = useState(null);
    const [articulos, setArticulos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [formasDePago, setFormasDePago] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const validateForm = () => {
        const form = document.querySelector('form');
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        });

        const selects = form.querySelectorAll('.react-select-container');
        selects.forEach(select => {
            const control = select.querySelector('.react-select__control');
            const selectedOption = control.querySelector('div[aria-selected="true"]');
            if (!selectedOption || !selectedOption.textContent.trim()) {
                control.classList.add('is-invalid');
                isValid = false;
            } else {
                control.classList.remove('is-invalid');
            }
        });

        const datePickers = form.querySelectorAll('.react-datepicker-wrapper');
        datePickers.forEach(datePicker => {
            const input = datePicker.querySelector('input');
            if (!input.value.trim()) {
                datePicker.classList.add('is-invalid');
                isValid = false;
            } else {
                datePicker.classList.remove('is-invalid');
            }
        });

        return isValid;
    };


    const options = articulos.map(articulo => ({
        value: { NUMERO: articulo.NUMERO, DESCRIP: articulo.DESCRIP, CODBARRAS: articulo.CODBARRAS, AUXILIAR4: articulo.AUXILIAR4 },
        label: articulo.DESCRIP
    }));

    const optionsClientes = clientes.map(cliente => ({
        value: { NUMERO: cliente.NUMERO, RAZONSOC: cliente.RAZONSOC },
        label: cliente.RAZONSOC
    }));

    const optionsFormasDePago = formasDePago.map(forma => ({
        value: forma.value,
        label: forma.label
    }));

    const optionsProvincias = provincias.map(provincia => ({
        value: provincia.value,
        label: provincia.label
    }));


    useEffect(() => {
        fetch(`${API_URL}/api/articulos`)
            .then(response => response.json())
            .then(data => {
                setArticulos(data.data);
            })
            .catch(error => console.error('Error fetching articulos:', error));
    }, []);


    useEffect(() => {
        if (user && user.numero_vendedor) {
            fetch(`${API_URL}/api/clientes?numero_vendedor=${user.numero_vendedor}`)
                .then(response => response.json())
                .then(data => {
                    setClientes(data.data);
                })
                .catch(error => console.error('Error fetching clientes:', error));
        } else {
            console.error("El usuario no tiene un numero_vendedor definido.");
        }
    }, [user]);


    useEffect(() => {
        fetch(`${API_URL}/api/tablas/formas-pago`)
            .then(response => response.json())
            .then(data => setFormasDePago(data.data))
            .catch(error => console.error('Error fetching formas de pago:', error));
    }, []);


    useEffect(() => {
        fetch(`${API_URL}/api/tablas/provincias`)
            .then(response => response.json())
            .then(data => setProvincias(data.data))
            .catch(error => console.error('Error fetching formas de pago:', error));
    }, []);


    // Actualiza el estado de un artículo específico en la lista cuando su valor cambia.
    const handleItemChange = (index, value, name) => {
        const newItems = [...items];
        newItems[index][name] = value;
        setItems(newItems);

        // Eliminar la clase 'is-invalid' si el campo tiene un valor válido
        if (value.trim() !== '') {
            document.getElementById(`item-${name}-${index}`).classList.remove('is-invalid');
        }
    };

    const handleClientChange = (selectedOption) => {
        setCLIENTE(selectedOption ? selectedOption.value : null);
    };

    const handleFormaDePagoChange = (selectedOption) => {
        setCONDVENTA(selectedOption ? selectedOption.value : null);
    };

    const handleProvinciasChange = (selectedOption) => {
        setPROENT(selectedOption ? selectedOption.value : null);
    };

    const handleArticuloChange = (index, selectedOption) => {
        const newItems = [...items];
        newItems[index].ARTICULO = selectedOption ? selectedOption.NUMERO : null;
        newItems[index].DESCART = selectedOption ? selectedOption.DESCRIP : null;
        newItems[index].CODBARRAS = selectedOption ? selectedOption.CODBARRAS : null;
        newItems[index].AUXILIAR4= selectedOption ? selectedOption.AUXILIAR4 : null;
        setItems(newItems);
    };

    const handleDateChange = (date) => {
        setFECTRANS(date);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    const handleChange = (e, setter) => {
        setter(e.target.value);
        if (e.target.value.trim()) {
            e.target.classList.remove('is-invalid');
        }
    };


    // Agrega un nuevo objeto de artículo vacío a la lista.
    // items es un array de objetos, donde cada objeto representa un artículo en el pedido.
    const addItem = () => {
        // Encontrar el máximo valor actual de ITEM en pedidoItems
        const maxItem = Math.max(...items.map(item => parseInt(item.ITEM, 10)));

        // Incrementar en 1 el máximo encontrado para obtener el nuevo ITEM
        const newItem = (maxItem + 1).toString().padStart(3, '0');

        setItems([...items, { 
            ITEM: newItem,
            ARTICULO: '',
            CANTPED: '',
            PRECIO: '',
            DESCUENTO: '',
        }]);
    };


    const removeItem = (index) => {
        const newItems = items.filter((item, i) => i !== index);
        setItems(newItems);
    };


    const handleImportPdf = () => {
        document.getElementById('pdfInput').click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            console.log('Archivo seleccionado:', file.name);
            const reader = new FileReader();
            reader.onload = async () => {
                const typedArray = new Uint8Array(reader.result);
                await parsePdf(typedArray);
            };
            reader.readAsArrayBuffer(file);
        } else {
            setError('Solo se permiten archivos PDF.');
            setShowModal(true);
            setModalMessage('Solo se permiten archivos PDF.'); 
        }
    };


    const parsePdf = async (typedArray) => {
        try {
            removeItem(0);
            console.log('Comenzando a parsear el PDF...');
            const loadingTask = pdfjsLib.getDocument({ data: typedArray });
    
            const pdf = await loadingTask.promise;
            console.log('PDF cargado:', pdf);
    
            const numPages = pdf.numPages;
            console.log(`El PDF tiene ${numPages} páginas.`);
    
            let orderItems = [];
    
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                console.log(`Página ${i} cargada.`);
    
                const textContent = await page.getTextContent();
                console.log(`Contenido de texto de la página ${i}:`, textContent.items);
    
                // Agrupar el texto en líneas completas
                const lines = [];
                let currentLine = '';
                let lastY = null;
    
                textContent.items.forEach((item, index) => {
                    const { str, transform } = item;
    
                    // Verificar que str es una cadena válida
                    if (typeof str !== 'string') {
                        console.warn(`Elemento ${index} no es un string:`, item);
                        return; // Saltar si no es un string válido
                    }
    
                    // Verificar que transform tiene la longitud esperada
                    if (!transform || transform.length < 6) {
                        console.warn(`Elemento ${index} no tiene un transform válido:`, item);
                        return; // Saltar si transform no tiene la longitud correcta
                    }
    
                    // Detectar nueva línea basada en el cambio vertical en 'transform'
                    const y = transform[5]; // Posición vertical
                    if (lastY === null || Math.abs(y - lastY) > 2) { // Ajustar la diferencia según sea necesario
                        if (currentLine.trim()) {
                            lines.push(currentLine.trim());
                        }
                        currentLine = str;
                    } else {
                        currentLine += ' ' + str;
                    }
    
                    lastY = y;
                });
    
                // Añadir la última línea si existe
                if (currentLine.trim()) {
                    lines.push(currentLine.trim());
                }
    
                let tableStarted = false;
    
                lines.forEach((line) => {
                    // Verificar que line es un string antes de usar includes
                    if (typeof line !== 'string') {
                        console.warn('Texto no es un string:', line);
                        return; // Saltar si no es un string válido
                    }
    
                    if (!tableStarted && line.includes('EAN')) {
                        tableStarted = true;
                        console.log('Encontrado el inicio de la tabla de EANs.');
                        return; // Continuar a la siguiente línea, ya que esta es la cabecera
                    }
    
                    if (tableStarted) {
                        const ean = extractEanFromLine(line);
    
                        if (ean) {
                            console.log('Línea completa:', line); // Imprime toda la línea de la tabla
    
                            // Divide la línea en componentes separados por espacio
                            const detailsArray = line.split(/\s+/);
    
                            // Crea un objeto JSON con la línea completa
                            const jsonObject = {
                                ean: detailsArray[0], // El primer valor como EAN
                                refProv: detailsArray[1],
                                descripcion: detailsArray.slice(2, -4).join(' '), // Todo el texto hasta las últimas 4 columnas
                                um: "",
                                uc: parseInt(detailsArray[detailsArray.length - 4]),
                                talle: "",
                                color: "",
                                cantPed: parseInt(detailsArray[detailsArray.length - 3], 10),
                                precio: parseFloat(detailsArray[detailsArray.length - 2])
                                // precio: parseFloat(detailsArray[detailsArray.length - 2].replace(',', '.'))
                            };
    
                            console.log('JSON de la fila:', jsonObject); // Muestra el objeto JSON por consola
    
                            orderItems.push(jsonObject);
                        }
                    }
                });
            }
    
            console.log('Ítems extraídos:', orderItems);
            addItemsToOrder(orderItems);
        } catch (error) {
            console.error('Error al parsear el PDF:', error);
        }
    };
    


    const addItemsToOrder = (orderItems) => {
        setItems((prevItems) => {
            const maxItem = prevItems.length > 0 ? Math.max(...prevItems.map(item => parseInt(item.ITEM, 10))) : 0;
    
            const newItems = orderItems.map((item, index) => {
                const articulo = articulos.find((art) => art.CODBARRAS === item.ean);

                if (articulo) {
                    console.log('Artículo encontrado:', articulo);
    
                    // Incrementar en 1 para cada nuevo artículo añadido
                    const newItemNumber = (maxItem + index + 1).toString().padStart(3, '0');
    
                    return {
                        ITEM: newItemNumber,
                        DESCART: articulo.DESCRIP,
                        ARTICULO: articulo.NUMERO,
                        CANTPED: item.cantPed || 0,
                        PRECIO: (item.precio * item.uc * 1.21) || 0.0,
                        DESCUENTO: 0
                    };
                } else {
                    console.log('Artículo no encontrado para EAN:', item.ean);
                    return null; 
                }
            }).filter(item => item !== null); 
    
            return [...prevItems, ...newItems]; 
        });
    };


    const extractEanFromLine = (line) => {
        const eanRegex = /(\d{13})/; 
        const match = line.match(eanRegex);
        return match ? match[0] : null;
    };

    const extractDetailsFromLine = (line) => {
        // Expresión regular para capturar cantidad y precio basado en el formato
        const detailsRegex = /\b(\d{13})\s+\d+\s+.*?\s+\d+\s+\d+\s+\S+\s+\S+\s+(\d+)\s+([\d,.]+)/;
        const match = line.match(detailsRegex);
    
        if (match) {
            const cantidad = match[2];
            const precio = match[3];
    
            console.log('Detalles extraídos:', { cantidad, precio });
    
            return {
                cantidad,
                precio
            };
        }
    
        console.log('No se encontraron detalles en la línea:', line);
        return {};
    };
    

    const generatePDF = (data, formaPagoLabel, provinciaLabel, nropedido) => {
        const doc = new jsPDF();

        const logo = 'iVBORw0KGgoAAAANSUhEUgAAA5MAAADrCAYAAAD0dsK4AAABHHpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjanVLbccQwCPxXFSkBsehVjmzrZtJBys9Kxrnz/V3wGPAKVjwcxs/3I3xNQZJgqdTcchaKNWva6VQ5ZVs6ii29pEHg6A0PY/MkJTRD4Anq+CBOH+a4XxKv+IvocmKnl54H++74dscPJ9T6TuQVIJ43y+EJTgQ98egEo582t1purT2G3KU+31KLomdDN7NomZk5NT5aEiQ1dED33GktAGgwFFRqgAH029KcC5S26F5IRh8LjzyPdGXz6mfrYS3nBVjbK9zfkdgRVAeThBrnuEkni7Iv0kmfGBcDK5kfcZaHtLYn/B9UCpN8o3H3SXAjrwP+s+IVvcsns7lGE/4zm/ALGWiU1jeznUcAAAGDaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFX1OlIhUHI6g4ZKhOdlGRjlqFIlQItUKrDiaXfkGThiTFxVFwLTj4sVh1cHHW1cFVEAQ/QFxdnBRdpMT/JYUWsR4c9+PdvcfdO0Col5lud80CuuFYqURcymRXpdArQhjGIETEFGabc7KcRMfxdY8AX++iPKvzuT9Hn5azGRCQiGeZaTnEG8Qzm47JeZ9YZEVFIz4nnrDogsSPXFd9fuNc8FjgmaKVTs0Ti8RSoY3VNmZFSyeeJo5oukH5QsZnjfMWZ71cZc178heGc8bKMtdpjiKBRSxBhgQVVZRQhoMorQYpNlK0H+/gH/H8MrlUcpXAyLGACnQonh/8D353a+enJv2kcBzofnHdjzEgtAs0aq77fey6jRMg+AxcGS1/pQ7EPkmvtbTIEdC/DVxctzR1D7jcAYaeTMVSPClIU8jngfcz+qYsMHAL9K75vTX3cfoApKmr5A1wcAiMFyh7vcO7e9p7+/dMs78f3Wty0duiLiUAAA42aVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA0LjQuMC1FeGl2MiI+CiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICB4bWxuczpHSU1QPSJodHRwOi8vd3d3LmdpbXAub3JnL3htcC8iCiAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICB4bWxuczpwZGY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGRmLzEuMy8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjE3MmQxZTNkLTVhOTItNDUxMC05MjVlLWUyNDMxYjUyMmY4NCIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5YmU4ZWRlNC1hM2MzLTQ3ZDItYjk5OC0yY2I0YzFlNDQzY2UiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxYjI3NTYwNS01NGZiLTQzZTctOWE5OC1jYTQ5YWY1MmU4OGUiCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09Ik1hYyBPUyIKICAgR0lNUDpUaW1lU3RhbXA9IjE2OTAzMjAxMDg2ODUxMTAiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zNCIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIHBkZjpBdXRob3I9InBhdWxhIHNhbmNoZXoiCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzOjA3OjI1VDE4OjIxOjQ1LTAzOjAwIgogICB4bXA6TW9kaWZ5RGF0ZT0iMjAyMzowNzoyNVQxODoyMTo0NS0wMzowMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjYzMmI5ZGQ5LTcwYjEtNDZiZS04Mzg4LWVmODU2NWZjNDMzMiIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChNYWMgT1MpIgogICAgICBzdEV2dDp3aGVuPSIyMDIzLTA3LTI1VDE4OjIxOjQ4LTAzOjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICAgPGRjOnRpdGxlPgogICAgPHJkZjpBbHQ+CiAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5HUyBsb2dvIC0gMTwvcmRmOmxpPgogICAgPC9yZGY6QWx0PgogICA8L2RjOnRpdGxlPgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+ljK6vQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB+cHGRUVMFMl8rwAAAA7dEVYdENvbW1lbnQAeHI6ZDpEQUZwRllZUnUwWTozLGo6NDM5NDc4NDM1MDc5MDcwNDI3Nyx0OjIzMDcx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'; 
        
        
        // Función para formatear la fecha actual
        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        // Obtener la fecha actual
        const today = new Date();
        const formattedToday = formatDate(today);
        

        doc.addImage(logo, 'PNG', 80, 7, 50, 15);

        // Añadir la fecha actual en la parte superior derecha
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.text(`${formattedToday}`, pageWidth - 25, 7);

        const startX = 15;
        const startY = 35;
        const lineHeight = 10;
        const cellHeight = 8;
        const labelWidth = 50;
        const valueWidth = 130;
        const totalWidth = labelWidth + valueWidth;


        // Dibujar celdas y añadir texto en formato de tabla
        const drawRow = (y, label, value, rowHeightMultiplier = 1) => {
            const effectiveCellHeight = cellHeight * rowHeightMultiplier;
            doc.setFont("helvetica", "bold");
            doc.rect(startX, y, labelWidth, effectiveCellHeight); // Dibujar celda de etiqueta
            doc.text(label, startX + 2, y + 6);
            doc.setFont("helvetica", "normal");
            doc.rect(startX + labelWidth, y, valueWidth, effectiveCellHeight); // Dibujar celda de valor
            doc.text(value, startX + labelWidth + 2, y + 6);
        };

        function formatNumber(num) {
            return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
        }

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("PEDIDO", 15, 30);

        // Agregar cada fila de datos
        let currentY = startY;
        drawRow(currentY, "Cliente:",  data.RAZONSOC.toUpperCase());
        currentY += cellHeight;
        drawRow(currentY, "Vendedor:",  user.nombre_vendedor.toUpperCase());
        currentY += cellHeight;
        drawRow(currentY, "Forma de Pago:", formaPagoLabel.toUpperCase());
        currentY += cellHeight;
        drawRow(currentY, "Dirección Entrega:",  data.DIREENT.toUpperCase());
        currentY += cellHeight;
        drawRow(currentY, "Localidad Entrega:",  data.LOCENT.toUpperCase());
        currentY += cellHeight;
        drawRow(currentY, "Provincia Entrega:", provinciaLabel.toUpperCase());
        currentY += cellHeight;
        drawRow(currentY, "Fecha Entrega:",  data.FECTRANS);
        currentY += cellHeight;
        drawRow(currentY, "Teléfono Entrega:",  data.TELEFONOS);
        currentY += cellHeight;
        drawRow(currentY, "Número Control:", nropedido);
        currentY += cellHeight;
        drawRow(currentY, "Comentarios:",  data.COMENTARIO.toUpperCase(), 3);
        currentY += cellHeight * 3;

        // Calcular la suma total de la columna Total
        let totalSum = data.items.reduce((sum, item) => {
            return sum + (item.CANTPED * (item.PRECIO - (item.PRECIO * item.DESCUENTO / 100)));
        }, 0);


        doc.autoTable({
            startY: 140,
            head: [['Item', 'Artículo', 'Cantidad', 'Precio', 'Descuento', 'Total']],
            body: [
                ...data.items.map(item => [
                    item.ITEM, 
                    item.DESCART, 
                    item.CANTPED, 
                    formatNumber(item.PRECIO), 
                    formatNumber(item.DESCUENTO), 
                    formatNumber(
                        item.CANTPED * (item.PRECIO - (item.PRECIO * item.DESCUENTO / 100))
                    ) 
                ]),
                // Fila adicional para la suma total
                ['', '', '', '', 'Total:', formatNumber(totalSum)]
            ],
        });

        doc.save('pedido.pdf');

    };
    

    // Gestiona el envío del formulario, recopila todos los datos del formulario y los envía a la API utilizando axios.
    // La función handleSubmit se ejecuta al enviar el formulario.
    // Hace una solicitud POST a la API para crear un nuevo pedido.
    // Si la solicitud es exitosa, resetea los campos del formulario.
    // Maneja errores de la solicitud y los imprime en la consola.
    // loading: indica si la solicitud está en curso y deshabilita el botón de envío mientras se procesa la solicitud.
    // error: almacena un mensaje de error si la solicitud falla y muestra el error en la interfaz de usuario.
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        setIsSubmitted(true);
        if (validateForm()) {
            handleSubmit(event);
        }

        const form = event.target;
        let valid = true;
        
        // Custom validation
        const requiredFields = form.querySelectorAll("[required]");
        requiredFields.forEach((field) => {
            if (!field.value) {
                valid = false;
                const errorMessage = field.getAttribute("data-error");
                field.setCustomValidity(errorMessage || "Por favor, complete este campo.");
            } else {
                field.setCustomValidity("");
            }
            field.reportValidity();
        });

        if (!valid) {
            return;
        }
    
        const formattedDate = FECTRANS ? format(FECTRANS, 'yyyy-MM-dd HH:mm:ss') : null;
        const today = new Date();
        const formattedToday = today ? format(today, 'yyyy-MM-dd HH:mm:ss.SSS') : null;

        const pedidoData = {
            CLIENTE: CLIENTE ? CLIENTE.NUMERO : '',
            RAZONSOC: CLIENTE ? CLIENTE.RAZONSOC : '',
            DIREENT,
            LOCENT,
            PROENT,
            CONDVENTA,
            TELEFONOS,
            VENDEDOR: user.numero_vendedor,
            FECTRANS: formattedDate,
            FECEMISION: formattedToday,
            COMENTARIO,
            USUARIO: user.username.toUpperCase(),
            items: items.map(item => ({
                ...item,
                ARTICULO: item.ARTICULO,
                DESCART: item.DESCART
            }))
        };
    
        try {
            const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
            const response = await fetch(`${API_URL}/api/pedidos`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Enviar el token en el encabezado de autorización
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pedidoData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el pedido');
            }
    
            const responseData = await response.json();
            const formaPagoLabel = optionsFormasDePago.find(option => option.value === CONDVENTA)?.label;
            const provinciaLabel = optionsProvincias.find(option => option.value === PROENT)?.label;
    
            setModalMessage('Pedido actualizado correctamente');
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/');  
            }, 3000);

    
            if (items && items.length > 0) {
                generatePDF(pedidoData, formaPagoLabel, provinciaLabel, responseData.data.newFuncion);
            } else {
                console.error('Error al generar PDF: no hay items');
                setError('Error al generar PDF: no hay items');
            }
    
            setCLIENTE('');
            setDIREENT('');
            setLOCENT('');
            setPROENT('');
            setCONDVENTA('');
            setTELEFONOS('');
            setFECTRANS(null);
            setFECEMISION(null);
            setCOMENTARIO('');
    
            setItems([{ 
                ITEM: '001',
                ARTICULO: '',
                CANTPED: '',
                PRECIO: '',
                DESCUENTO: '',
            }]);
    
        } catch (error) {
            console.error('Error al crear el pedido', error);
            setError('Error al crear el pedido');
            setModalMessage(`Error: ${error.message}`);
            setShowModal(true);
        } 
    };
    
    const closeModal = () => {
        setShowModal(false);
    };


    return (
        <div className="form-container w-100">
            <form className="w-100" onSubmit={handleSubmit} noValidate autoComplete="off">
            <div className="bg-primary text-white h4" align="center" colSpan="11"><b>NUEVO PEDIDO</b></div>
            <div className="form-container w-100">
                <div className="form-card w-25 mr-4 mt-2 mb-4 border border-primary">
                    <div className="form-group">
                        <label>Cliente</label>
                            <Select
                                name="CLIENTE"
                                value={optionsClientes.find(option => option.value.NUMERO === (CLIENTE ? CLIENTE.NUMERO : '')) || null}
                                onChange={handleClientChange}
                                options={optionsClientes}
                                isSearchable
                                placeholder="Seleccionar Cliente"
                                menuPortalTarget={document.body}
                                classNamePrefix="react-select"
                                className={`react-select-container ${isSubmitted && !CLIENTE ? 'is-invalid' : ''}`}
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                menuPosition="fixed"
                                required
                                data-error="Por favor, seleccione un cliente."
                            />
                    </div>
                    
                    <div className="form-group">
                        <label>Forma de Pago</label>
                        <Select
                            name="CONDVENTA"
                            value={optionsFormasDePago.find(option => option.value === CONDVENTA) || null}
                            onChange={handleFormaDePagoChange}
                            options={optionsFormasDePago}
                            autoComplete="off"
                            isSearchable
                            placeholder="Seleccionar Forma de Pago"
                            menuPortalTarget={document.body}
                            classNamePrefix="react-select"
                            className={`react-select-container ${isSubmitted && !CONDVENTA ? 'is-invalid' : ''}`}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            menuPosition="fixed"
                            required
                            data-error="Por favor, seleccione una forma de pago."
                        />
                    </div>

                    <div className="form-group">
                        <label>Direccion Entrega</label>
                        <input
                            type="text"
                            name="DIREENT"
                            value={DIREENT} 
                            onChange={(e) => handleChange(e, setDIREENT)} 
                            required
                            data-error="Por favor, ingrese la dirección de entrega."
                        />
                    </div>

                    <div className="form-group">
                        <label>Localidad Entrega</label>
                        <input
                            type="text"
                            name="LOCENT"
                            value={LOCENT} 
                            onChange={(e) => handleChange(e, setLOCENT)} 
                            required
                            data-error="Por favor, ingrese la localidad de entrega." 
                        />
                    </div>

                    <div className="form-group">
                        <label>Provincia Entrega</label>
                        <Select
                            name="PROENT"
                            value={optionsProvincias.find(option => option.value === PROENT) || null}
                            onChange={handleProvinciasChange}
                            options={optionsProvincias}
                            isSearchable
                            placeholder="Seleccionar Provincia"
                            menuPortalTarget={document.body}
                            classNamePrefix="react-select"
                            className={`react-select-container ${isSubmitted && !PROENT ? 'is-invalid' : ''}`}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            menuPosition="fixed"
                            required
                            data-error="Por favor, seleccione una provincia."
                        />
                    </div>

                    <div className="form-group">
                        <label>Fecha Entrega</label>
                        <DatePicker
                            name="FECTRANS"
                            selected={FECTRANS}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                            placeholderText="Seleccionar Fecha"
                            required
                            data-error="Por favor, seleccione una fecha de entrega."
                        />
                    </div>

                    <div className="form-group">
                        <label>Telefono Entrega</label>
                        <input
                            type="number"
                            name="TELEFONOS"
                            value={TELEFONOS} 
                            onChange={(e) => handleChange(e, setTELEFONOS)} 
                            required
                            data-error="Por favor, ingrese un teléfono de entrega."
                        />
                    </div>

                    <div className="form-group">
                        <label>Comentarios</label>
                        <textarea
                            name="COMENTARIO"
                            value={COMENTARIO}
                            onChange={(e) => setCOMENTARIO(e.target.value)} 
                            rows="3" 
                        ></textarea>
                    </div>
                </div>

                <div className="form-card w-75 mt-2 mb-4 border border-primary">
                    <div className="form-container d-flex justify-content-between">
                        <h3>Items del Pedido</h3>
                        <div>
                            <button type="button" className="btn btn-outline-success mr-3 mb-2 mt-1" onClick={addItem} style={{ marginRight: '10px' }}><FontAwesomeIcon icon={faPlus} /></button>
                            <button onClick={handleImportPdf} className="btn btn-outline-primary mr-2 mb-2 mt-1" style={{ borderRadius: '4px' }} disabled={CLIENTE.NUMERO !== '0340002'}>Importar PDF</button>
                                <input
                                type="file"
                                accept="application/pdf"
                                id="pdfInput"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                />
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr className="table-row">
                                    <th className="column column-small">Item</th>
                                    <th className="column">Articulo</th>
                                    <th className="column column-medium">Cantidad</th>
                                    <th className="column column-medium">Precio</th>
                                    <th className="column column-medium">Descuento</th>
                                    <th className="column column-small">Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index} className="table-row">
                                        <td className="form-group column column-small"><input type="text" name="ITEM" value={item.ITEM} onChange={(e) => handleItemChange(index, e)} required readOnly/></td>
                                        <td className="form-group column">
                                            <Select
                                                name="ARTICULO"
                                                value={options.find(option => option.value.NUMERO === item.ARTICULO) || null}
                                                onChange={(selectedOption) => handleArticuloChange(index, selectedOption.value)}
                                                options={options}
                                                isSearchable
                                                placeholder="Seleccionar Artículo"
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                menuPosition="fixed"
                                                required
                                                data-error="Por favor, seleccione un artículo."
                                            />
                                        </td>
                                        <td className="form-group column column-medium">
                                            <NumericFormat
                                                value={item.CANTPED}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                allowNegative={false}
                                                isAllowed={(values) => {
                                                    const { floatValue } = values;
                                                    return (floatValue === undefined || floatValue <= 99999) && (values.value === '' || Number.isInteger(floatValue));
                                                }}
                                                onValueChange={(values) => handleItemChange(index, values.value, 'CANTPED')}
                                                required 
                                                data-error="Por favor, ingrese la cantidad."
                                                maxLength={6}
                                                id={`item-CANTPED-${index}`}
                                            />
                                        </td>
                                        <td className="form-group column column-medium">
                                            <NumericFormat
                                                value={item.PRECIO}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                allowNegative={false}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                isAllowed={(values) => {
                                                    const { floatValue, formattedValue } = values;
                                                    return (floatValue === undefined || floatValue <= 99999) && (formattedValue === '' || /^\d{1,5}(\.\d{3})*(,\d{0,2})?$/.test(formattedValue));
                                                }}
                                                onValueChange={(values) => handleItemChange(index, values.value, 'PRECIO')}
                                                required 
                                                data-error="Por favor, ingrese el precio."
                                                maxLength={10}
                                                id={`item-PRECIO-${index}`}
                                            />
                                        </td>
                                        <td className="form-group column column-medium">
                                            <NumericFormat
                                                value={item.DESCUENTO}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                allowNegative={false}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                isAllowed={(values) => {
                                                    const { floatValue, formattedValue } = values;
                                                    return (floatValue === undefined || floatValue <= 100) && (formattedValue === '' || /^\d{1,3}(\.\d{3})*(,\d{0,2})?$/.test(formattedValue));
                                                }}
                                                onValueChange={(values) => handleItemChange(index, values.value, 'DESCUENTO')}
                                                required 
                                                data-error="Por favor, ingrese el descuento."
                                                onKeyDown={handleKeyDown} 
                                                id={`item-DESCUENTO-${index}`}
                                            />
                                        </td>
                                        <td className="form-group column column-small text-center">
                                            <button type="button" className="btn btn-sm btn-outline-danger remove-button" onClick={() => removeItem(index)} disabled={item.ITEM === '001'}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>    
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>
                <div className="form-buttons">
                    <button type="submit" className="m-4 btn btn-primary">Guardar</button>
                    <button type="button" className="m-4 btn btn-secondary" onClick={() => navigate('/')}>Cancelar</button>
                </div>
            </form>

            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalMessage.startsWith('Error') ? 'Error' : 'Éxito'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{modalMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );

}

export default PedidosNew;




