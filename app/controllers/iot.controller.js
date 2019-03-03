const axios = require('axios');
exports.room=(req, res)=>{
    var lightPin = null;
    var fanPin = null;
    axios.all([
        axios.get('http://188.166.206.43/daf3e1c00f0a4f0fafb37a82c3686037/get/D0'),
        axios.get('http://188.166.206.43/daf3e1c00f0a4f0fafb37a82c3686037/get/D4')
    ]).then(axios.spread((response1, response2) => {
        lightPin = (parseInt(response1.data)=== 1 ? 0: 1),
        fanPin = (parseInt(response2.data)=== 1 ? 0: 1)
        axios.all([
            axios.get('http://188.166.206.43/daf3e1c00f0a4f0fafb37a82c3686037/update/D0?value='+ lightPin),
            axios.get('http://188.166.206.43/daf3e1c00f0a4f0fafb37a82c3686037/update/D4?value='+ fanPin)
        ]).then(axios.spread((response1, response2) => {
            return res.status(200).send({
                message: "Done"
            });  
        })).catch(error => {
            console.log(error);
        });
    })).catch(error => {
        console.log(error);
    });

       
        
       

}