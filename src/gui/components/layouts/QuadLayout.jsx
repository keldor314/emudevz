import classNames from "classnames";
import Layout from "./Layout";
import styles from "./Layout.module.css";

export default class QuadLayout extends Layout {
	static get requiredComponentNames() {
		return ["TopLeft", "BottomLeft", "TopRight", "BottomRight"];
	}

	state = { selectedY: "Top", selectedX: "Left" };

	render() {
		this.requireComponents();
		const { TopLeft, BottomLeft, TopRight, BottomRight } = this.props;
		const { selectedX, selectedY } = this.state;

		return (
			<div className={styles.container} onKeyDownCapture={this.onKeyDown}>
				<div className={classNames(styles.leftColumn, styles.column)}>
					<div
						className={classNames(
							styles.topRow,
							styles.row,
							selectedY === "Top" && selectedX === "Left"
								? styles.selected
								: styles.unselected
						)}
						onMouseDown={(e) => {
							this.setState({ selectedY: "Top", selectedX: "Left" });
						}}
					>
						<TopLeft
							ref={(ref) => {
								this.instances.TopLeft = ref;
							}}
						/>
					</div>

					<div
						className={classNames(
							styles.bottomRow,
							styles.row,
							selectedY === "bottom" && selectedX === "Left"
								? styles.selected
								: styles.unselected
						)}
						onMouseDown={(e) => {
							this.setState({ selectedY: "bottom", selectedX: "Left" });
						}}
					>
						<BottomLeft
							ref={(ref) => {
								this.instances.BottomLeft = ref;
							}}
						/>
					</div>
				</div>

				<div className={classNames(styles.rightColumn, styles.column)}>
					<div
						className={classNames(
							styles.topRow,
							styles.row,
							selectedY === "Top" && selectedX === "Right"
								? styles.selected
								: styles.unselected
						)}
						onMouseDown={(e) => {
							this.setState({ selectedY: "Top", selectedX: "Right" });
						}}
					>
						<TopRight
							ref={(ref) => {
								this.instances.TopRight = ref;
							}}
						/>
					</div>

					<div
						className={classNames(
							styles.bottomRow,
							styles.row,
							selectedY === "bottom" && selectedX === "Right"
								? styles.selected
								: styles.unselected
						)}
						onMouseDown={(e) => {
							this.setState({ selectedY: "bottom", selectedX: "Right" });
						}}
					>
						<BottomRight
							ref={(ref) => {
								this.instances.BottomRight = ref;
							}}
						/>
					</div>
				</div>
			</div>
		);
	}

	focus(instanceName) {
		switch (instanceName) {
			case "TopLeft": {
				this.setState({ selectedY: "Top", selectedX: "Left" });
				break;
			}
			case "BottomLeft": {
				this.setState({ selectedY: "Bottom", selectedX: "Left" });
				break;
			}
			case "TopRight": {
				this.setState({ selectedY: "Top", selectedX: "Right" });
				break;
			}
			case "BottomRight": {
				this.setState({ selectedY: "Bottom", selectedX: "Right" });
				break;
			}
			default:
		}

		super.focus(instanceName);
	}

	onKeyDown = (e) => {
		const { selectedX, selectedY } = this.state;
		const keys = this.getKeyBindings().paneNavigation;
		const key = e.key?.toUpperCase?.() || "";

		if ((key === "ARROWRIGHT" || key === keys.right) && e.altKey) {
			if (selectedX === "Left") {
				if (selectedY === "Top") this.focus("TopRight");
				else this.focus("BottomRight");
			}
			e.preventDefault();
			e.stopPropagation();
		}

		if ((key === "ARROWLEFT" || key === keys.left) && e.altKey) {
			if (selectedX === "Right") {
				if (selectedY === "Top") this.focus("TopLeft");
				else this.focus("BottomLeft");
			}
			e.preventDefault();
			e.stopPropagation();
		}

		if ((key === "ARROWUP" || key === keys.up) && e.altKey) {
			if (selectedY === "bottom") {
				if (selectedX === "Left") this.focus("TopLeft");
				else this.focus("TopRight");
			}
			e.preventDefault();
			e.stopPropagation();
		}

		if ((key === "ARROWDOWN" || key === keys.down) && e.altKey) {
			if (selectedY === "Top") {
				if (selectedX === "Left") this.focus("BottomLeft");
				else this.focus("BottomRight");
			}
			e.preventDefault();
			e.stopPropagation();
		}
	};
}
