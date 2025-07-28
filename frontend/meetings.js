document.addEventListener('DOMContentLoaded', async () => {
    const calendarEl = document.getElementById('calendar');
    const meetingsList = document.getElementById("meetingsList");

    async function fetchMeetings() {
        const res = await fetch("/api/meetings");
        const meetings = await res.json();

        // Atualiza a lista de reuniões
        meetingsList.innerHTML = "";
        meetings.forEach(meeting => {
            const button = document.createElement("button");
            button.className = "meeting-button";
            button.textContent = `${meeting.consultant} → ${meeting.client}`;
            button.onclick = () => showMeeting(meeting); 
            meetingsList.appendChild(button);
        });

        // Atualiza o calendário
        const events = meetings.map(m => ({
            title: `${m.consultant} com ${m.client}`,
            start: m.datetime
        }));

        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events
        });

        calendar.render();
    }

    function showMeeting(meeting) {
        const detail = document.getElementById('meetingDetail');
        detail.innerHTML = `
            <h4>Detalhes da Reunião</h4>
            <p><b>Consultor:</b> ${meeting.consultant}</p>
            <p><b>Cliente:</b> ${meeting.client}</p>
            <p><b>Data/Hora:</b> <time>${new Date(meeting.datetime).toLocaleString()}</time></p>
        `;
    }

    // Adiciona o evento de submissão do formulário
    document.getElementById('meetingForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            consultant: formData.get("consultant"),
            client: formData.get("client"),
            datetime: formData.get("datetime")
        };

        await fetch("/api/meetings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        e.target.reset();
        fetchMeetings(); // Atualiza a lista de reuniões após a submissão
    });

    fetchMeetings(); // Carrega as reuniões ao iniciar
});
