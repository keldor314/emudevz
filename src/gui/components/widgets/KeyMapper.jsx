import React, { PureComponent } from "react";
import { FaUndo } from "react-icons/fa";
import classNames from "classnames";
import IconButton from "./IconButton";
import Tooltip from "./Tooltip";
import styles from "./KeyMapper.module.css";

const MODIFIER_KEYS = new Set(["CONTROL", "ALT", "SHIFT", "META", "ALTGRAPH"]);

const formatKeyPart = (key) => {
	if (key === "ARROWLEFT") return "◄";
	if (key === "ARROWRIGHT") return "►";
	if (key === "ARROWUP") return "▲";
	if (key === "ARROWDOWN") return "▼";
	if (key === " ") return "SPACE";
	return key;
};

export const getKeyLabel = (keyBinding) => {
	if (!keyBinding) return "?";
	return keyBinding.split("+").map(formatKeyPart).join("+");
};

export const buildKeyBindingFromEvent = (event) => {
	const parts = [];
	if (event.ctrlKey || event.metaKey) parts.push("CTRL");
	if (event.altKey) parts.push("ALT");
	if (event.shiftKey) parts.push("SHIFT");
	parts.push(event.key.toUpperCase());
	return parts.join("+");
};

export const isModifierKey = (event) => {
	return MODIFIER_KEYS.has(event.key.toUpperCase());
};

export const ButtonBox = ({
	onClick,
	className,
	children,
	isDuplicate = false,
	wide = false,
	...rest
}) => {
	return (
		<Tooltip title={children} placement="top">
			<div
				onClick={onClick}
				className={classNames(
					styles.buttonBox,
					wide && styles.buttonBoxWide,
					className
				)}
				style={isDuplicate ? { filter: "blur(2px)" } : undefined}
				{...rest}
			>
				{children}
			</div>
		</Tooltip>
	);
};

export default class KeyMapper extends PureComponent {
	state = { waitingKey: null };

	render() {
		const {
			title,
			items,
			mapping,
			defaultMapping,
			onReset,
			resetTooltip,
			className,
			layout = "row",
		} = this.props;
		const { waitingKey } = this.state;

		const effective = { ...(defaultMapping || {}), ...(mapping || {}) };

		const counts = {};
		for (let id of items.map((it) => it.id)) {
			const v = effective[id];
			if (!v) continue;
			counts[v] = (counts[v] || 0) + 1;
		}

		const isColumn = layout === "column";

		return (
			<div className={classNames(styles.container, className)}>
				{(title || onReset) && (
					<div className={styles.titleRow}>
						<span>{title}</span>
						{!!onReset && (
							<IconButton
								Icon={FaUndo}
								tooltip={resetTooltip}
								onClick={onReset}
							/>
						)}
					</div>
				)}

				<div className={isColumn ? styles.keysColumn : styles.keysRow}>
					{items.map((it) => {
						const value = effective[it.id];
						const isDuplicate = value && counts[value] > 1;
						return (
							<div
								key={it.id}
								className={isColumn ? styles.keyGroupRow : styles.keyGroup}
							>
								<div className={styles.keyLabel}>{it.label}</div>
								<ButtonBox
									onClick={() => this._waitFor(it.id)}
									isDuplicate={isDuplicate}
									wide={isColumn}
								>
									{waitingKey === it.id ? "..." : getKeyLabel(value)}
								</ButtonBox>
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	componentWillUnmount() {
		if (this._onKey) {
			window.removeEventListener("keydown", this._onKey);
			this._onKey = null;
		}
	}

	_waitFor = (id) => {
		this.setState({ waitingKey: id });

		if (this._onKey) {
			window.removeEventListener("keydown", this._onKey);
			this._onKey = null;
		}

		const onKey = (e) => {
			e.preventDefault();
			e.stopPropagation();

			if (isModifierKey(e)) return;

			window.removeEventListener("keydown", onKey);
			this._onKey = null;

			const { waitingKey } = this.state;
			if (!waitingKey) return;

			const next = {
				...(this.props.defaultMapping || {}),
				...(this.props.mapping || {}),
			};
			next[waitingKey] = buildKeyBindingFromEvent(e);
			this.props.onChange(next);
			this.setState({ waitingKey: null });
		};

		this._onKey = onKey;
		window.addEventListener("keydown", this._onKey);
	};
}
