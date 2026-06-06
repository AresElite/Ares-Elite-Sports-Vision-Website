const { execSync } = require('child_process');
try {
  const output = execSync('git log -p -1 src/components/sections/TrainingShowcase.tsx').toString();
  console.log(output);
} catch (e) {
  console.log("Error:", e.message);
}
