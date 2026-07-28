//criar conta no emailjs
//criar um service
//criar um template

(function () {
    emailjs.init("JbhCgfE4FVCUgM5fS");//account -> public key
})();

document
    .getElementById("contactForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();

        let data = new FormData(this);

        emailjs
            .send("service_rkt73kv", "template_dotqb4p", {
                name: data.get("name"),
                email: data.get("email"),
                message: data.get("message"),
            })
            .then(
                function (response) {
                    alert("o seu email foi enviado com sucesso!");
                },
                function (error) {
                    alert("Falha de envio");
                    console.error("EmailJS error:", error);
                },
            );

        this.reset()
    });