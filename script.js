
const myResume = 'Paste your resume here or select a PDF file...';


const matchButton = document.getElementById('matchButton');
const jobDescriptionInput = document.getElementById('jobDescription');

const candidateResumeInput = document.getElementById('candidateResume');

document.getElementById('candidateResume').textContent = myResume;
const outputDiv = document.getElementById('output');
const generateCoverLetterCheckbox = document.getElementById('generateCoverLetter'); // Get the checkbox element


matchButton.addEventListener('click', async () => {
    const jobDescription = jobDescriptionInput.value;
    const candidateResume = candidateResumeInput.value;
    const isCoverLetter = generateCoverLetter.checked;
    const isCheckCVErrors = checkCVErrors.checked;
    const isBetterExperience = betterExperience.checked;
    const isIncludeKeywords = includeKeywords.checked;
    const isScreeningQuestions = screeningQuestions.checked;
    const isTechnicalQuestions = technicalQuestions.checked;


    try {
        const textarea = document.createElement('textarea');
        /*                
                        let prompt = `Job Description: ${jobDescription}\nCandidate Resume: ${candidateResume}\nProvide the answer in the following sections (as numbered list - use the numbers from the section description), bullets for other infomration): 
                        1. Is the candidate a good match for the job? 
                        2. List skills that are a good match and skills that are required by the job description but not mentioned in the resume. Provides both skills list as bulleted lists.  
                        3. List the number of years of experience based on the resume. 
                        4. Summarize years of experience for professional skills.  
                        5. Specify howl long worked in each company, and indicate employment periods of less than 2 years, indicate gaps in the employment. 
                        6. Indicate if the candidate got promoted in the same company or changed positions in the same company.`;
        */

        let prompt = `**Job Description:**
${jobDescription}
**Candidate Resume:**
${candidateResume}
**Assume you are a recruiter. Please provide your analysis in the following sections (use numbers for clarity), and use bullet points for additional details where necessary:**
1. **Overall Match:** Assess whether the candidate is a good fit for the job.
2. **Skills Assessment:** 
- List skills in the candidate's resume that match the job description.
- Identify skills required by the job description but not found in the resume.
3. **Years of Experience:** Calculate the total years of relevant experience based on the candidate's resume.
4. **Professional Experience Summary:** Summarize the years of experience for each professional skill or role mentioned. Provide the number of years.
5. **Employment History:** 
- Specify the duration of employment at each company in years.
- Highlight any employment periods lasting less than 2 years.
- Identify any gaps in the candidate's employment history.
6. **Promotions and Position Changes:** Indicate if the candidate has received promotions or changed positions within the same company.
Provide your responses in a clear and concise manner.
`;

        if (isCoverLetter) {
            // If the checkbox is checked, add the cover letter generation part to the prompt
            prompt += `\n7. **Cover Letter:** Generate a short cover letter in simple english and limit it to 100 words. include it here. Use the candidate's name from the resume in the signature.`;
        }
        if (isCheckCVErrors)
        {
            prompt += `\n8. Review the resume and ensure it is free of errors and effectively communicates my experience and skills.`;
        }
        if (isBetterExperience)
        {
            prompt += `\n9. Please update the following bullets so that they are more outcome-focused and metric-oriented.`;
        }
        if (isIncludeKeywords)
        {
            prompt += `\n10. Tailor my resume so it will include all relevant keywords from the job description`;
        }
        if (isScreeningQuestions)
        {
            prompt += `\n11. I got my first screen interview with in house recruiter for the following role. Please come up with 10 screening questions that I'll might be asked so I can get prepared.`;
        }
        
        if (isTechnicalQuestions)
        {
            prompt += `\n12. Please review the job description and come up with relevant 10 technical questions that I might be asked by the hiring manager.`;
        }
    

        textarea.value = prompt;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        outputDiv.textContent = prompt;

        alert('Prompt copied to clipboard! Open ChatGPT window and paste it there.');
    } catch (error) {
        console.error('Error:', error);
        outputDiv.textContent = 'An error occurred while processing the request.';
    }
});



//Handle input of resume from PDf
// Specify the workerSrc property for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

document.getElementById('pdfFile').addEventListener('change', function (e) {
    const file = e.target.files[0];

    if (file && file.type === 'application/pdf') {
        const reader = new FileReader();

        reader.onload = function (e) {
            const arrayBuffer = e.target.result;

            // Load PDF using pdf.js
            pdfjsLib.getDocument({ data: arrayBuffer }).promise.then(function (pdf) {
                // Loop through each page and extract text
                let textContent = '';
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {


                    pdf.getPage(pageNum).then(function (page) {
                        return page.getTextContent();
                    }).then(function (pageText) {
                        // Combine text from all pages
                        let tmpContent = '';
                        tmpContent += pageText.items.map(item => item.str + '').join('') + '\n';
                        tmpContent += textContent;
                        textContent = tmpContent;
                        //textContent += pageText.items.map(item => item.str + ' ').join('');

                        // Display the combined text in the textarea
                        document.getElementById('candidateResume').value = textContent.trim();
                    });
                }
            });
        };

        reader.readAsArrayBuffer(file);
    } else {
        alert('Please select a valid PDF file.');
        // Clear the input field
        document.getElementById('pdfFile').value = '';
    }
});
