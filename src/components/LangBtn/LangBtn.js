import React, {useState} from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import {withStyles} from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import {lightGreen} from '@material-ui/core/colors';

const CustomInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    color: lightGreen[50],
    fontSize: '0.9em',
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
  },
}))(InputBase);

const LangBtn = (props) => {
  const {setLocale} = props;
  const [selLang, setSelLang] = useState('English');

  const toggleLang = (targetLang) => {
    if (targetLang === 'English') {
      setLocale('en');
    } else {
      setLocale('zh-Hant');
    }
  };

  const handleChange = (e) => {
    const targetLang = e.target.value;
    setSelLang(targetLang);
    toggleLang(targetLang);
  };

  return (
    <Select
      variant="standard"
      id="lang-select"
      value={selLang}
      input={<CustomInput />}
      onChange={(e) => handleChange(e)}>
      <MenuItem value="English">English</MenuItem>
      <MenuItem value="正體中文">正體中文</MenuItem>
    </Select>
  );
};

export default LangBtn;
