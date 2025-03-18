import { memo } from 'react';
import { Button } from '@mui/material';


export const EmarkFileUploader = ({ setCsvData}) => {

  const handleFileChange = async(event) => {
    const file = event.target.files[0];

    if (file && file.type === 'text/csv') {
      const formData = new FormData();

      formData.append('file', file);
      setCsvData(formData)
    }else{
       alert("No file choosen")
    }
  };
  

  return (
    <div>
      <Button>
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </Button>
    </div>
  )
};

export default memo(EmarkFileUploader) ;
