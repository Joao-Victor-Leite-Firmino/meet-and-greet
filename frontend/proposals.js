async function loadProposals() {
    const res = await fetch('/api/proposals');
    const data = await res.json();
    const list = document.getElementById('proposalsList');
    list.innerHTML = '';

    data.forEach(p => {
        const button = document.createElement('button');
        button.className = "proposal-button";
        button.textContent = `${p.consultant} → ${p.client} (Status: ${p.status})`;
        button.onclick = () => showProposal(p);
        list.appendChild(button);
    });
}

function showProposal(p) {
    const detail = document.getElementById('proposalDetail');
    detail.innerHTML = `
        <h4>Proposta #${p.id}</h4>
        <p><b>Consultor:</b> ${p.consultant}</p>
        <p><b>Cliente:</b> ${p.client}</p>
        <p><b>Descrição:</b> ${p.description}</p>
        <p><b>Valor:</b> R$ ${p.amount.toFixed(2)}</p>
        <p><b>Status:</b> ${p.status}</p>
        <button onclick="updateProposalStatus(${p.id}, 'aceita')">Proposta Aceita</button>
        <button onclick="updateProposalStatus(${p.id}, 'recusada')">Proposta Recusada</button>
        <button onclick="deleteProposal(${p.id})">Excluir Proposta</button> <!-- Botão para excluir proposta -->
    `;
}

async function updateProposalStatus(id, status) {
    await fetch(`/api/proposals/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    loadProposals();
}

async function deleteProposal(id) {
    await fetch(`/api/proposals/${id}`, {
        method: 'DELETE'
    });
    loadProposals();
}

document.getElementById('proposalForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
        consultant: form.consultant.value,
        client: form.client.value,
        description: form.description.value,
        amount: parseFloat(form.amount.value)
    };
    await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    loadProposals();
});

document.getElementById('downloadProposals').addEventListener('click', async () => {
    const consultant = document.getElementById('consultantSelect').value;
    if (consultant) {
        window.location.href = `/api/proposals/download?consultant=${consultant}`;
    } else {
        alert('Por favor, selecione um consultor.');
    }
});

async function loadConsultants() {
    const res = await fetch('/api/proposals');
    const data = await res.json();
    const consultants = [...new Set(data.map(p => p.consultant))];
    const select = document.getElementById('consultantSelect');
    consultants.forEach(consultant => {
        const option = document.createElement('option');
        option.value = consultant;
        option.textContent = consultant;
        select.appendChild(option);
    });
}

loadProposals();
loadConsultants();
