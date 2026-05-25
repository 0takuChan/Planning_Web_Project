(async () => {
  const fetch = (await import('node-fetch-native')).default;
  const jwt = (await import('jsonwebtoken')).default;
  const basePort = process.env.PORT || '4000';
  const baseUrl = `http://localhost:${basePort}`;
  const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';
  const token = jwt.sign({ id: 0, username: 'system', role: 'system' }, JWT_SECRET, { expiresIn: '5m' });

  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  try {
    console.log('Fetching job steps...');
    const jsRes = await fetch(`${baseUrl}/api/jobsteps`, { headers });
    const jobSteps = await jsRes.json();
    if (!Array.isArray(jobSteps) || jobSteps.length === 0) {
      console.error('No jobSteps found');
      return;
    }

    const jobStep = jobSteps.find(js => js.minutes_per_unit && js.minutes_per_unit > 0);
    if (!jobStep) {
      console.error('No jobStep with minutes_per_unit found');
      return;
    }

    const job_step_id = jobStep.job_step_id;
    const stepId = jobStep.step.step_id;
    console.log('Selected job_step_id', job_step_id, 'stepId', stepId);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0,10);

    console.log('Creating planning for', dateStr);
    const createRes = await fetch(`${baseUrl}/api/plannings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ job_step_id, planned_date: dateStr, planned_quantity: 1 }),
    });

    console.log('Create status', createRes.status);
    const created = await createRes.json().catch(() => ({}));
    console.log('Created planning response:', created);

    console.log('Fetching step...');
    const stepRes = await fetch(`${baseUrl}/api/steps/${stepId}`, { headers });
    const step = await stepRes.json();
    console.log('Current step:', step);

    const newStandard = (step.standard_time || 480) + 1;
    console.log('Updating step standard_time to', newStandard);
    const updRes = await fetch(`${baseUrl}/api/steps/${stepId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ step_name: step.step_name, standard_time: newStandard, priority: step.priority }),
    });

    console.log('Update status', updRes.status);
    const updBody = await updRes.json().catch(() => ({}));
    console.log('Update response:', JSON.stringify(updBody, null, 2));
  } catch (err) {
    console.error('Test failed:', err);
  }
})();
