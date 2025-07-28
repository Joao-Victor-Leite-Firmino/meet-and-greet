const API_URL = 'http://localhost:3000/api';

document.getElementById('btnSchedule').addEventListener('click', scheduleMeeting);
document.getElementById('btnSendProposal').addEventListener('click', sendProposal);

async function scheduleMeeting() {
  const consultant = document.getElementById('meetingConsultant').value.trim();
  const client = document.getElementById('meetingClient').value.trim();
  const datetime = document.getElementById('meetingDatetime').value;

  if (!consultant || !client || !datetime) {
    alert('Preencha todos os campos da reunião');
    return;
  }

  const res = await fetch(`${API_URL}/meetings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ consultant, client, datetime }),
  });

  if (res.ok) {
    alert('Reunião agendada com sucesso!');
    loadMeetings();
    clearMeetingForm();
  } else {
    const data = await res.json();
    alert('Erro: ' + (data.error || 'Não foi possível agendar'));
  }
}

async function sendProposal() {
  const consultant = document.getElementById('proposalConsultant').value.trim();
  const client = document.getElementById('proposalClient').value.trim();
  const description = document.getElementById('proposalDescription').value.trim();
  const amount = parseFloat(document.getElementById('proposalAmount').value);

  if (!consultant || !client || !description || isNaN(amount)) {
    alert('Preencha todos os campos da proposta');
    return;
  }

  const res = await fetch(`${API_URL}/proposals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ consultant, client, description, amount }),
  });

  if (res.ok) {
    alert('Proposta enviada com sucesso!');
    loadProposals();
    clearProposalForm();
  } else {
    const data = await res.json();
    alert('Erro: ' + (data.error || 'Não foi possível enviar a proposta'));
  }
}

async function loadMeetings() {
  const res = await fetch(`${API_URL}/meetings`);
  const meetings = await res.json();

  const container = document.getElementById('meetingsList');
  container.innerHTML = meetings.length
    ? meetings.map(m => `<div class="list-item">
        <strong>${m.consultant}</strong> → ${m.client} <br/>
        Data e Hora: ${new Date(m.datetime).toLocaleString()}
      </div>`).join('')
    : '<p>Nenhuma reunião agendada.</p>';
}

async function loadProposals() {
  const res = await fetch(`${API_URL}/proposals`);
  const proposals = await res.json();

  const container = document.getElementById('proposalsList');
  container.innerHTML = proposals.length
    ? proposals.map(p => `<div class="list-item">
        <strong>${p.consultant}</strong> → ${p.client} <br/>
        ${p.description} <br/>
        Valor: R$ ${p.amount.toFixed(2)}
      </div>`).join('')
    : '<p>Nenhuma proposta enviada.</p>';
}

function clearMeetingForm() {
  document.getElementById('meetingConsultant').value = '';
  document.getElementById('meetingClient').value = '';
  document.getElementById('meetingDatetime').value = '';
}

function clearProposalForm() {
  document.getElementById('proposalConsultant').value = '';
  document.getElementById('proposalClient').value = '';
  document.getElementById('proposalDescription').value = '';
  document.getElementById('proposalAmount').value = '';
}

// Carregar dados ao abrir a página
loadMeetings();
loadProposals();
