import { useState, useCallback, useMemo } from 'react';
import React from 'react';
import {
  Card,
  Avatar,
  ResourceList,
  ResourceItem,
  Tag,
  Listbox,
  Combobox,
  Icon,
  TextContainer,
  Stack,
} from '@shopify/polaris';
import { MobileCancelMajor, SearchMinor } from '@shopify/polaris-icons';
import '../../styles/components/SpecificProducts.css';
import productTags from '../../data/productTags';


function ProductTags() {


  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(productTags);

  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === '') {
        setOptions(productTags);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = productTags.filter((option) => option.match(filterRegex));
      setOptions(resultOptions);
    },
    [productTags]
  );

  const updateSelection = useCallback(
    (selected) => {
      if (selectedOptions.includes(selected)) {
        setSelectedOptions(selectedOptions.filter((option) => option !== selected));
      } else {
        setSelectedOptions([...selectedOptions, selected]);
      }

      const matchedOption = options.find((option) => {
        return option.match(selected);
      });

      updateText('');
    },
    [options, selectedOptions, updateText]
  );

  const removeTag = useCallback(
    (tag) => () => {
      const options = [...selectedOptions];
      options.splice(options.indexOf(tag), 1);
      setSelectedOptions(options);
    },
    [selectedOptions]
  );

    // const lstCollectonSelected = useMemo(() => productTags.filter((tag) => selectedOptions.includes(tag)),[selectedOptions]);


  const optionsMarkup =
    options.length > 0
      ? options.map((option,index) => {

          return (
            <Listbox.Option
              key={index}
              value={option}
              selected={selectedOptions.includes(option)}
              accessibilityLabel={option}
            >
              {option}
            </Listbox.Option>
          );
        })
      : null;

      const tagsMarkup = selectedOptions.map((option) => (
        <Tag key={`option-${option}`} onRemove={removeTag(option)}>
          {option}
        </Tag>
      ));

  return (
    <div className="specific-products">
      <Combobox
        allowMultiple
        activator={
          <Combobox.TextField
            prefix={<Icon source={SearchMinor} />}
            onChange={updateText}
            label="Search tags"
            labelHidden
            value={inputValue}
            placeholder="Search Products"
          />
        }
      >
        {optionsMarkup ? (
          <Listbox autoSelection="NONE" onSelect={updateSelection}>
            {optionsMarkup}
          </Listbox>
        ) : null}
      </Combobox>
      <TextContainer>
        <Stack>{tagsMarkup}</Stack>
      </TextContainer>
    </div>
  );
}

export default ProductTags;
