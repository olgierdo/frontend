import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { ArrowIcon } from 'assets';
import { useOutsideClick } from 'hooks';
import {
  StyledArrowImage,
  StyledInput,
  StyledSelect,
  StyledSelectCaption,
  StyledTopWrapper,
  StyledWrapper,
} from './Select.styled';
import Option from '../Option';
import { ISelect } from './Select.model';
import { ISingleOption } from '../SelectInput.model';

const Select = ({
  isMulti,
  options,
  onClick,
  selectCaption,
  inputPlaceholder,
}: ISelect): JSX.Element => {
  const [mutableOptions, setMutableOptions] = useState<ISingleOption[]>(options);
  const [selectedOptions, setSelectedOptions] = useState<ISingleOption[]>([]);
  const [currentOptionId, setCurrentOptionId] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(containerRef, () => {
    setIsOpen(false);
  });

  const doesArrayConsistValue = (id: string) => {
    return selectedOptions.filter((element: ISingleOption) => element.id === id).length;
  };

  const isInputTextMatch = (inputText: string, value: string) => {
    const regex = new RegExp(`^${inputText}`, 'i');
    return regex.test(value);
  };

  const updateSelectedOptions = (option: ISingleOption): void => {
    const { id } = option;
    setCurrentOptionId(id);
    if (isMulti) {
      if (!doesArrayConsistValue(id)) {
        setSelectedOptions([option, ...selectedOptions]);
      } else {
        const newArray = selectedOptions.filter((element: ISingleOption) => element.id !== id);
        setSelectedOptions([...newArray]);
      }
    } else {
      setSelectedOptions([option]);
    }
  };

  const filterOptions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const filteredOptions = options.filter((option) => isInputTextMatch(inputValue, option.value));
    setMutableOptions(filteredOptions);
  };

  const toggleList = (e: MouseEvent<HTMLDivElement>) => {
    const clickedElementName = (e.target as HTMLDivElement).localName;
    setMutableOptions(options);
    if (clickedElementName !== 'input') {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    onClick(() => selectedOptions);
  }, [selectedOptions, onClick]);

  return (
    <StyledWrapper ref={containerRef}>
      <StyledTopWrapper onClick={toggleList}>
        {isOpen ? (
          <StyledInput placeholder={inputPlaceholder} handleOnChange={filterOptions} />
        ) : (
          <StyledSelectCaption id="selectCaption">{selectCaption}</StyledSelectCaption>
        )}
        <StyledArrowImage isOpen={isOpen} src={ArrowIcon} />
      </StyledTopWrapper>
      {isOpen && (
        <StyledSelect aria-multiselectable={isMulti} aria-labelledby="selectCaption" role="listbox">
          {mutableOptions.map((option) => (
            <Option
              key={option.id}
              option={option}
              isMulti={isMulti}
              selectedOptions={selectedOptions}
              currentOptionId={currentOptionId}
              updateSelectedOptions={updateSelectedOptions}
            />
          ))}
        </StyledSelect>
      )}
    </StyledWrapper>
  );
};

export default Select;
