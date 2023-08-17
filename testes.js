fetch('https://viacep.com.br/ws/13s218650/json/')
    .then(response => response.json())
        .then((json) => {
            Object.values(json).forEach(item =>{
                console.log(item);
            })
        })
    .catch((err) => {
        console.log('erro');
    })