async function loadProposals() {
    const res = await fetch('/api/proposals');
    const data = await res.json();
    const list = document.getElementById('proposalsList');
    list.innerHTML = '';

    data.forEach(p => {
        const button = document.createElement('button');
        button.className = "proposal-button";
        button.textContent = `${p.consultant} → ${p.client} (Status: ${formatStatus(p.status)})`;
        button.onclick = () => showProposal(p);
        list.appendChild(button);
    });
}

function formatStatus(status) {
    if (!status || status === 'undefined') {
        return 'Proposta Enviada';
    }
    switch (status) {
        case 'enviada':
            return 'Proposta Enviada';
        case 'aceita':
            return 'Proposta Aceita';
        case 'recusada':
            return 'Proposta Recusada';
        default:
            return 'Status Desconhecido';
    }
}

function showProposal(p) {
    const detail = document.getElementById('proposalDetail');
    detail.innerHTML = `
        <h4>Proposta #${p.id}</h4>
        <p><b>Consultor:</b> ${p.consultant}</p>
        <p><b>Cliente:</b> ${p.client}</p>
        <p><b>Descrição:</b> ${p.description}</p>
        <p><b>Valor:</b> R$ ${p.amount.toFixed(2)}</p>
        <p><b>Status:</b> ${formatStatus(p.status)}</p>
        <button onclick="updateProposalStatus(${p.id}, 'aceita')">Aceitar Proposta</button>
        <button onclick="updateProposalStatus(${p.id}, 'recusada')">Recusar Proposta</button>
        <button onclick="deleteProposal(${p.id})">Excluir Proposta</button> <!-- Botão para excluir proposta -->
    `;
}

async function updateProposalStatus(id, status) {
    await fetch(`/api/proposals/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    loadProposals(); // Recarrega as propostas após a atualização
}

async function deleteProposal(id) {
    await fetch(`/api/proposals/${id}`, {
        method: 'DELETE'
    });
    loadProposals(); // Recarrega as propostas após a exclusão
}

document.getElementById('downloadProposals').addEventListener('click', async () => {
    const consultant = document.getElementById('consultantSelect').value;
    if (consultant) {
        window.location.href = `/api/proposals/download?consultant=${consultant}`; // Faz o download das propostas
    } else {
        alert('Por favor, selecione um consultor.');
    }
});

// Função para carregar consultores no select
async function loadConsultants() {
    const res = await fetch('/api/proposals'); // Aqui você pode usar uma rota que retorna apenas os consultores únicos
    const data = await res.json();
    const consultants = [...new Set(data.map(p => p.consultant))]; // Obtém consultores únicos
    const select = document.getElementById('consultantSelect');
    consultants.forEach(consultant => {
        const option = document.createElement('option');
        option.value = consultant;
        option.textContent = consultant;
        select.appendChild(option);
    });
}

loadProposals();
loadConsultants(); // Carrega os consultores ao iniciar
