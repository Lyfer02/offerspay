// src/components/CustomDatePicker.js
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import { colors } from '../src/utils/color';

export default function CustomDatePicker({
  selected,
  onChange,
  placeholder = 'Select Date',
  maxDate = new Date(),
  minDate,
  label,
  mode = 'single',
}) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(
    selected ? new Date(selected) : undefined
  );

  useEffect(() => {
    setInternalValue(selected ? new Date(selected) : undefined);
  }, [selected]);

  const handleConfirm = ({ date }) => {
    setOpen(false);
    if (date) {
      setInternalValue(date);
      onChange?.(date);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.inputText}>
          {internalValue
            ? internalValue.toLocaleDateString('en-GB')
            : placeholder}
        </Text>
      </TouchableOpacity>

      <DatePickerModal
        locale="en"
        mode={mode}
        visible={open}
        onDismiss={() => setOpen(false)}
        date={internalValue || new Date()}
        onConfirm={handleConfirm}
        validRange={{ start: minDate, end: maxDate }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  inputText: {
    color: colors.black,
    fontSize: 14,
  },
});
