async function likeWoman(id, button) {
        try {
                const response = await fetch(`/like/${id}`, {
                        method: 'POST',
                });

                console.log('Resposta do servidor:', response); // Adicione este log

                if (response.ok) {
                        const data = await response.json();
                        const likeCountElement = button.nextElementSibling;
                        likeCountElement.innerText = data.likes;
                } else {
                        console.error('Erro ao atualizar curtidas:', response.statusText);
                }
        } catch (error) {
                console.error('Erro ao enviar a solicitação:', error);
        }
}
